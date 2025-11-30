// tiny-vb-interpreter.js
// Minimal interpreter for a VB-like subset in JavaScript.
// Drop into a browser page, wire inputProvider and outputHandler.
// NOTE: This is a starting point and intentionally keeps some features simple.

class Token {
  constructor(type, value, pos = 0) {
    this.type = type; // e.g. 'NUMBER', 'IDENT', 'PLUS', 'IF'
    this.value = value;
    this.pos = pos;
  }
}

function isAlpha(ch) { return /[A-Za-z_]/.test(ch); }
function isDigit(ch) { return /[0-9]/.test(ch); }
function isAlphaNum(ch) { return /[A-Za-z0-9_]/.test(ch); }

// --- Tokenizer ---
function tokenize(code) {
  const tokens = [];
  let i = 0;
  const push = (t) => tokens.push(t);

  while (i < code.length) {
    let ch = code[i];
    if (ch === ' ' || ch === '\t' || ch === '\r') { i++; continue; }
    if (ch === '\n') { push(new Token('NEWLINE', '\n', i)); i++; continue; }

    // strings: "..."
    if (ch === '"' || ch === "'") {
      const quote = ch; i++;
      let val = '';
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < code.length) {
          val += code[i+1]; i += 2; continue;
        }
        val += code[i++]; 
      }
      i++; // skip closing
      push(new Token('STRING', val, i));
      continue;
    }

    // numbers (integers and floats)
    if (isDigit(ch)) {
      let s = '';
      while (i < code.length && (isDigit(code[i]) || code[i] === '.')) { s += code[i++]; }
      push(new Token('NUMBER', parseFloat(s), i));
      continue;
    }

    // identifiers or keywords
    if (isAlpha(ch)) {
      let s = '';
      while (i < code.length && isAlphaNum(code[i])) s += code[i++];

      const up = s.toUpperCase();
      // keywords set
      const kws = new Set(['IF','THEN','ELSE','ELSEIF','END','WHILE','WEND','DO','LOOP','FOR','NEXT','DIM','AS','FUNCTION','SELECT','CASE','NOT','AND','OR']);
      if (kws.has(up)) {
        push(new Token(up, up, i));
      } else {
        push(new Token('IDENT', s, i));
      }
      continue;
    }

    // two-char operators
    const two = code.substr(i,2);
    if (two === '<=' || two === '>=' || two === '<>') { push(new Token(two, two, i)); i += 2; continue; }

    // single char tokens
    const map = {
      '+':'PLUS','-':'MINUS','*':'MUL','/':'DIV','^':'POW',
      '(':'LPAREN',')':'RPAREN',',':'COMMA','=':'EQ','<':'LT','>':'GT',
      '&':'AMP',';':'SEMICOLON'
    };
    if (map[ch]) { push(new Token(map[ch], ch, i)); i++; continue; }

    // unknown char -> skip
    i++;
  }

  push(new Token('EOF', null, i));
  return tokens;
}

// --- Parser (recursive descent) ---
// Grammar (simplified):
// program -> statement* EOF
// statement -> assignment | ifstmt | whilestmt | exprstmt
// assignment -> IDENT '=' expr
// exprstmt -> functioncall | expr
// ifstmt -> IF expr THEN newline? statements (ELSEIF expr THEN statements)* (ELSE statements)? END IF
// whilestmt -> WHILE expr statements END WHILE
//
// Expressions: precedence climbing (handle & as concat)

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }
  peek() { return this.tokens[this.pos]; }
  next() { return this.tokens[this.pos++]; }
  expect(type) {
    const t = this.peek();
    if (t.type !== type) throw new Error(`Expected ${type} but got ${t.type} @${t.pos}`);
    return this.next();
  }

  parseProgram() {
    const stmts = [];
    while (this.peek().type !== 'EOF') {
      if (this.peek().type === 'NEWLINE') { this.next(); continue; }
      stmts.push(this.parseStatement());
    }
    return { type: 'Program', body: stmts };
  }

  parseStatement() {
    const t = this.peek();
    if (t.type === 'IDENT') {
      // assignment or function call
      const look = this.tokens[this.pos + 1];
      if (look && look.type === 'EQ') return this.parseAssignment();
      return { type: 'ExprStmt', expr: this.parseExpr() };
    }
    if (t.type === 'IF') return this.parseIf();
    if (t.type === 'WHILE') return this.parseWhile();
    // fallback expression statement
    return { type: 'ExprStmt', expr: this.parseExpr() };
  }

  parseAssignment() {
    const name = this.next().value; // IDENT
    this.expect('EQ');
    const expr = this.parseExpr();
    return { type: 'Assign', name, expr };
  }

  parseIf() {
    this.expect('IF');
    const cond = this.parseExpr();
    this.expect('THEN');
    // consume optional NEWLINEs
    while (this.peek().type === 'NEWLINE') this.next();
    const consequent = [];
    while (this.peek().type !== 'ELSE' && this.peek().type !== 'ELSEIF' && !(this.peek().type === 'END' && this.tokens[this.pos+1] && this.tokens[this.pos+1].type === 'IF')) {
      if (this.peek().type === 'EOF') throw new Error("Unclosed IF");
      consequent.push(this.parseStatement());
      while (this.peek().type === 'NEWLINE') this.next();
    }
    const elifs = [];
    while (this.peek().type === 'ELSEIF') {
      this.next();
      const c = this.parseExpr();
      this.expect('THEN');
      while (this.peek().type === 'NEWLINE') this.next();
      const body = [];
      while (this.peek().type !== 'ELSE' && this.peek().type !== 'ELSEIF' && !(this.peek().type === 'END' && this.tokens[this.pos+1] && this.tokens[this.pos+1].type === 'IF')) {
        body.push(this.parseStatement());
        while (this.peek().type === 'NEWLINE') this.next();
      }
      elifs.push({ cond: c, body });
    }
    let alternate = null;
    if (this.peek().type === 'ELSE') {
      this.next();
      while (this.peek().type === 'NEWLINE') this.next();
      const body = [];
      while (!(this.peek().type === 'END' && this.tokens[this.pos+1] && this.tokens[this.pos+1].type === 'IF')) {
        body.push(this.parseStatement());
        while (this.peek().type === 'NEWLINE') this.next();
      }
      alternate = body;
    }
    // expect END IF
    this.expect('END');
    this.expect('IF');
    return { type: 'If', cond, consequent, elifs, alternate };
  }

  parseWhile() {
    this.expect('WHILE');
    const cond = this.parseExpr();
    // optional NEWLINE
    while (this.peek().type === 'NEWLINE') this.next();
    const body = [];
    while (!(this.peek().type === 'END' && this.tokens[this.pos+1] && this.tokens[this.pos+1].type === 'WHILE')) {
      body.push(this.parseStatement());
      while (this.peek().type === 'NEWLINE') this.next();
    }
    this.expect('END'); this.expect('WHILE');
    return { type: 'While', cond, body };
  }

  // Expression parser: precedence climbing
  parseExpr() {
    return this.parseBinary(0);
  }

  // precedence table
  precedence(op) {
    switch(op) {
      case 'OR': return 1;
      case 'AND': return 2;
      case 'EQ': case '<>': case 'LT': case 'GT': case '<=': case '>=': return 3;
      case 'PLUS': case 'MINUS': case 'AMP': return 4; // AMP (&) concat
      case 'MUL': case 'DIV': return 5;
      case 'POW': return 6;
      default: return 0;
    }
  }

  parsePrimary() {
    const t = this.peek();
    if (t.type === 'NUMBER') { this.next(); return { type: 'Literal', value: t.value }; }
    if (t.type === 'STRING') { this.next(); return { type: 'Literal', value: t.value }; }
    if (t.type === 'IDENT') {
      // could be function call or variable
      const name = this.next().value;
      if (this.peek().type === 'LPAREN') {
        // call
        this.next(); // LPAREN
        const args = [];
        if (this.peek().type !== 'RPAREN') {
          while (true) {
            args.push(this.parseExpr());
            if (this.peek().type === 'COMMA') { this.next(); continue; }
            break;
          }
        }
        this.expect('RPAREN');
        return { type: 'Call', name, args };
      }
      return { type: 'Variable', name };
    }
    if (t.type === 'LPAREN') {
      this.next();
      const e = this.parseExpr();
      this.expect('RPAREN');
      return e;
    }
    if (t.type === 'NOT') {
      this.next();
      return { type: 'Unary', op: 'NOT', expr: this.parsePrimary() };
    }
    throw new Error(`Unexpected token ${t.type} in primary`);
  }

  parseUnary() {
    const t = this.peek();
    if (t.type === 'PLUS' || t.type === 'MINUS') {
      this.next();
      return { type: 'Unary', op: t.type, expr: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  parseBinary(minPrec) {
    let left = this.parseUnary();
    while (true) {
      const t = this.peek();
      // treat AND, OR, EQ, etc. as operators
      let opKind = t.type;
      // normalize some tokens
      if (!['PLUS','MINUS','MUL','DIV','POW','AMP','AND','OR','NOT','EQ','<>','LT','GT','<=','>='].includes(opKind)) break;
      const prec = this.precedence(opKind);
      if (prec <= minPrec) break;
      this.next(); // consume operator
      const right = this.parseBinary(prec);
      left = { type: 'Binary', op: opKind, left, right };
    }
    return left;
  }
}

// --- Interpreter ---
// environment: object mapping var names to {type, value}
// inputProvider: async (prompt) => string
// outputHandler: (message) => void
// maxSteps: cap for safety

class Interpreter {
  constructor(ast, { inputProvider = async (p) => prompt(p) , outputHandler = (m) => console.log(m), maxSteps = 100000 } = {}) {
    this.ast = ast;
    this.env = {}; // variables
    this.inputProvider = inputProvider;
    this.outputHandler = outputHandler;
    this.maxSteps = maxSteps;
    this.steps = 0;
  }

  async run() {
    for (const stmt of this.ast.body) {
      await this.execStatement(stmt);
      if (this.steps > this.maxSteps) throw new Error("Exceeded max steps (possible infinite loop)");
    }
  }

  incrSteps() { if (++this.steps > this.maxSteps) throw new Error("Exceeded max steps"); }

  async execStatement(stmt) {
    this.incrSteps();
    switch (stmt.type) {
      case 'Assign':
        this.env[stmt.name] = await this.evalExpr(stmt.expr);
        return;
      case 'ExprStmt':
        await this.evalExpr(stmt.expr);
        return;
      case 'If':
        if (await this.evalExpr(stmt.cond)) {
          for (const s of stmt.consequent) await this.execStatement(s);
        } else {
          let done = false;
          for (const elif of stmt.elifs) {
            if (await this.evalExpr(elif.cond)) {
              for (const s of elif.body) await this.execStatement(s);
              done = true; break;
            }
          }
          if (!done && stmt.alternate) {
            for (const s of stmt.alternate) await this.execStatement(s);
          }
        }
        return;
      case 'While':
        while (await this.evalExpr(stmt.cond)) {
          for (const s of stmt.body) {
            await this.execStatement(s);
          }
          this.incrSteps();
        }
        return;
      default:
        throw new Error("Unknown statement type " + stmt.type);
    }
  }

  // evaluate expression nodes
  async evalExpr(node) {
    this.incrSteps();
    switch (node.type) {
      case 'Literal': return node.value;
      case 'Variable':
        if (!(node.name in this.env)) return null;
        return this.env[node.name];
      case 'Unary': {
        const v = await this.evalExpr(node.expr);
        if (node.op === 'MINUS') return -v;
        if (node.op === 'PLUS') return +v;
        if (node.op === 'NOT') return !this.toBool(v);
        return null;
      }
      case 'Binary': {
        const L = await this.evalExpr(node.left);
        const R = await this.evalExpr(node.right);
        switch (node.op) {
          case 'PLUS': return L + R;
          case 'MINUS': return L - R;
          case 'MUL': return L * R;
          case 'DIV': return L / R;
          case 'POW': return Math.pow(L, R);
          case 'EQ': return L == R;
          case '<>': return L != R;
          case 'LT': return L < R;
          case 'GT': return L > R;
          case '<=': return L <= R;
          case '>=': return L >= R;
          case 'AND': return this.toBool(L) && this.toBool(R);
          case 'OR': return this.toBool(L) || this.toBool(R);
          case 'AMP': // concatenation
            return String(L) + String(R);
        }
        return null;
      }
      case 'Call': {
        const name = node.name;
        const args = [];
        for (const a of node.args) args.push(await this.evalExpr(a));
        // builtins:
        if (name.toUpperCase() === 'MSGBOX') {
          this.outputHandler(args.join(' '));
          return null;
        }
        if (name.toUpperCase() === 'INPUTBOX') {
          // prompt user via injected provider
          const promptText = args[0] !== undefined ? args[0] : '';
          const val = await this.inputProvider(promptText);
          // attempt number conversion if looks numeric
          const n = Number(val);
          return isNaN(n) ? val : n;
        }
        if (name.toUpperCase() === 'INT') {
          return Math.trunc(Number(args[0]));
        }
        if (name.toUpperCase() === 'LEN') {
          return (args[0] === null || args[0] === undefined) ? 0 : String(args[0]).length;
        }
        if (name.toUpperCase() === 'RND') {
          return Math.random();
        }
        if (name.toUpperCase() === 'MATH.ROUND' || (name.toUpperCase()==='ROUND' && node.name!=='Math.Round')) {
          return Math.round(Number(args[0]));
        }
        // fallback: undefined function
        throw new Error(`Unknown function ${name}`);
      }
      default:
        throw new Error(`Unknown expr node ${node.type}`);
    }
  }

  toBool(v) {
    // VB-ish truthiness: 0/""/false => false; others true
    if (v === false || v === null || v === undefined) return false;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v.length > 0;
    return Boolean(v);
  }
}

// --- Convenience API ---
async function runCode(source, options = {}) {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  const ast = parser.parseProgram();
  const interpreter = new Interpreter(ast, options);
  await interpreter.run();
  return interpreter.env; // for introspection
}

// Example usage (in browser main thread):
// runCode(`x = 2\nMsgBox("Hello & " & x)`,
//   { inputProvider: async (p) => { return window.prompt(p || "Input:"); },
//     outputHandler: (m) => { console.log("MSGBOX:", m); alert(m); } })
// .then(env => console.log("Finished. Env:", env))
// .catch(e => console.error("Error:", e));
