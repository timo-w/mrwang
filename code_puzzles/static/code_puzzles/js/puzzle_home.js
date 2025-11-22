/* Scripts for code puzzle pages */

$(document).ready(function() {

    console.log("Puzzle script loaded!");

    const modal = $("#appModal");
    const modalTitle = $("#modalTitle");
    const modalTopics = $("#modalTopics");
    const modalCode = $("#modalCode");

    // Open modal when clicking a grid button
    $(".grid-button-small").on("click", function() {
        const title = $(this).data("title");
        const topics = $(this).data("topics");

        // Read the code from the hidden <pre>
        const code = $(this).find(".program-code").text().replace(/\\r/g, "");
        // Indent code
        code = indentVB(code);

        modalTitle.text(title);
        modalTopics.text(topics || "None");
        modalCode.html(code);
        
        // Re-highlight using Prism
        Prism.highlightElement(modalCode[0]);

        modal.addClass("show");
    });


});

function indentVB(code) {
    const lines = code.split("\n");
    const indented = [];
    let level = 0;

    const increase = ["If", "While", "For", "Sub", "Function", "Do"];
    const decrease = ["End If", "End While", "End Sub", "End Function", "Loop", "Next"];

    for (let raw of lines) {
        let line = raw.trim();

        // Decrease before writing the line if it's a closing block
        if (decrease.some(d => line.startsWith(d))) {
            level = Math.max(0, level - 1);
        }

        indented.push("    ".repeat(level) + line);

        // Increase after writing if it's an opening block
        if (increase.some(i => line.startsWith(i))) {
            level++;
        }
    }

    return indented.join("\n");
}