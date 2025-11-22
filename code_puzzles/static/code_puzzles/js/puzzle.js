/* Scripts for code puzzle pages */

$(document).ready(function() {

    console.log("Puzzle script loaded!");

    const modal = $("#appModal");
    const modalTitle = $("#modalTitle");
    const modalTopics = $("#modalTopics");
    const modalCode = $("#modalCode");

    // Open modal when clicking a grid button
    $(".grid-button").on("click", function() {
        const title = $(this).data("title");
        const topics = $(this).data("topics");

        // Read the code from the hidden <pre>
        const code = $(this).find(".program-code").text().replace(/\\r/g, "");

        modalTitle.text(title);
        modalTopics.text(topics || "None");
        modalCode.html(code);
        // Re-highlight using Prism
        Prism.highlightElement(modalCode[0]);

        modal.addClass("show");
    });


});