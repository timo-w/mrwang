/* Scripts for code puzzle pages */

$(document).ready(function() {

    console.log("Puzzle script loaded!");

    const modal = $("#appModal");
    const modalTitle = $("#modalTitle");
    const modalTopics = $("#modalTopics");
    const modalDescription = $("#modalDescription");
    const modalCode = $("#modalCode");

    // Open modal when clicking a grid button
    $(".grid-button-small").on("click", function() {
        const title = $(this).data("title");
        const topics = $(this).data("topics");
        const description = $(this).data("description")

        // Read the code from the hidden <pre>
        let code = $(this).find(".program-code").text().replace(/\\r/g, "");
        // Indent and highlight code
        code = highlightVB(indentVB(code));

        modalTitle.text(title);
        modalTopics.text(topics || "None");
        modalDescription.text(description);
        modalCode.html(code);
        
        modal.addClass("show");
    });


});
