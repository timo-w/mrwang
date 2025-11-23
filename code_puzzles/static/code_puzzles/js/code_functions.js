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

// Colour highlight VB code
function highlightVB(code) {
    let html = code;

    // --- 1. Strings: "anything"
    html = html.replace(/"([^"]*)"/g, (match) => {
        return `<span class="vb-string">${match}</span>`;
    });

    // --- 2. Numbers: integers or decimals (not inside strings now)
    html = html.replace(/\b\d+(\.\d+)?\b/g, (match) => {
        return `<span class="vb-number">${match}</span>`;
    });

    // --- 3. Keywords: If, Else, Sub, Function, Then, End, MsgBox, InputBox...
    const keywords = [
        "If", "Then", "Else", "ElseIf", "End", "Sub", "Function",
        "While", "For", "Do", "Loop", "Next", "Dim", "As",
        "And", "Or", "Not", "Return"
    ];

    const funcs = ["MsgBox", "InputBox", "Len", "Rnd", "Math", "Round"];

    // Keywords (blue)
    const kwRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
    html = html.replace(kwRegex, `<span class="vb-keyword">$1</span>`);

    // Functions (slightly different blue)
    const fnRegex = new RegExp(`\\b(${funcs.join("|")})\\b`, "g");
    html = html.replace(fnRegex, `<span class="vb-func">$1</span>`);

    return html;
}