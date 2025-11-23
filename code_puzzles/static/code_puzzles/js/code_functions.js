// Functions for VB code parsing


// Indent VB code
function indentVB(code) {
    const lines = code.split("\n");
    const indented = [];
    let level = 0;

    const increase = ["If", "While", "For", "Sub", "Function", "Do"];
    const decrease = ["End If", "End While", "End Sub", "End Function", "Loop", "Next"];

    for (let raw of lines) {
        let line = raw.trim();
        const isElse = line.startsWith("Else") && !line.startsWith("ElseIf");

        const isElseIf = line.startsWith("ElseIf");

        // Handle closing block indentation
        if (decrease.some(d => line.startsWith(d))) {
            level = Math.max(0, level - 1);
        }

        // Special case: Else / ElseIf align with the matching If
        if (isElse || isElseIf) {
            indented.push("    ".repeat(Math.max(0, level - 1)) + line);
        } else {
            indented.push("    ".repeat(level) + line);
        }

        // Handle opening block indentation
        if (increase.some(i => line.startsWith(i))) {
            level++;
        }
    }

    return indented.join("\n");
}

// Colour highlight VB code (input-aware)
function highlightVB(codeHtml) {
    // codeHtml may already contain HTML (e.g. <input ...>)
    let html = String(codeHtml);

    // 1. Extract input fields (blanks) so highlighting won't touch HTML tags
    const inputMatches = [];
    html = html.replace(/<input\b[^>]*>/gi, match => {
        const placeholder = `__INP${inputMatches.length}__`;
        inputMatches.push(match);
        return placeholder;
    });

    // 2. Extract strings and replace with placeholders so they won't be touched.
    const stringMatches = [];
    html = html.replace(/"([^"]*)"/g, (match) => {
        const placeholder = `__STR${stringMatches.length}__`;
        stringMatches.push(match); // keep full quoted text including quotes
        return placeholder;
    });

    // At this point html has no <input...> and no "..." substrings

    // 3. Highlight numbers (outside strings / inputs)
    html = html.replace(/\b\d+(\.\d+)?\b/g, (match) => {
        return `<span class="vb-number">${match}</span>`;
    });

    // 4. Highlight keywords
    const keywords = [
        "If", "Then", "Else", "ElseIf", "End", "Sub", "Function",
        "While", "For", "Do", "Loop", "Next", "Dim", "As",
        "And", "Or", "Not", "Return"
    ];
    // Use word boundaries, but keep case-insensitive for safety (VB keywords usually TitleCase)
    const kwRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    html = html.replace(kwRegex, `<span class="vb-keyword">$1</span>`);

    // 5. Highlight function calls
    const funcs = ["MsgBox", "InputBox", "Len", "Rnd", "Math", "Round"];
    const fnRegex = new RegExp(`\\b(${funcs.join("|")})\\b`, "g");
    html = html.replace(fnRegex, `<span class="vb-func">$1</span>`);

    // 6. Put the strings back, fully green (or use your vb-string style)
    stringMatches.forEach((str, i) => {
        // str includes surrounding quotes e.g. "\"Hello\""
        const safe = `<span class="vb-string">${str}</span>`;
        html = html.replace(`__STR${i}__`, safe);
    });

    // 7. Put blanks (input fields) back
    inputMatches.forEach((inp, i) => {
        html = html.replace(`__INP${i}__`, inp);
    });

    return html;
}