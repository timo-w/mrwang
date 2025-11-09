/* Scripts for quiz generator */

$(document).ready(function(){
    console.log("Quiz_gen script loaded!");

    let open = false;

    // Open more quiz options
    $('#more-options').on('click', function() {
        $('.collapsable').slideToggle();
        if (open) {
            open = false;
            $(this).html("&darr; More options &darr;");
        } else {
            open = true;
            $(this).html("&uarr; Hide options &uarr;");
        }
    });

});