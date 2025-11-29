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


// Custom VB highlighter
function highlightVB(raw) {
    let text = raw;

    // Step 0: extract string literals and replace them with placeholders
    const stringPlaceholders = [];
    text = text.replace(/"([^"]*)"/g, function(match) {
        const ph = `__STRING_${stringPlaceholders.length}__`;
        stringPlaceholders.push(match); // store the full match including quotes
        return ph;
    });

    // 1. Numbers (outside strings)
    text = text.replace(/\b\d+(\.\d+)?\b/g, function(match) {
        return `<span class="vb-number">${match}</span>`;
    });

    // 2. Keywords
    const keywords = [
        "If", "Then", "Else", "ElseIf", "End",
        "While", "Do", "Loop", "For", "Next", "Until",
        "Sub", "Function", "Return", "Dim", "As",
        "String", "Integer", "Single", "Char",
        "And", "Or", "Not", "New", "To"
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    text = text.replace(keywordRegex, match => `<span class="vb-keyword">${match}</span>`);

    // 3. Function calls (identifiers followed by parentheses)
    text = text.replace(/([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, match => `<span class="vb-func">${match}</span>`);

    // 4. Put string literals back
    stringPlaceholders.forEach((str, i) => {
        const ph = `__STRING_${i}__`;
        text = text.replace(ph, `<span class="vb-string">${str}</span>`);
    });

    return text;
}