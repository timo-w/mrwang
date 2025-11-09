/* Scripts for photography page */

$(document).ready(function(){
    console.log("Photography script loaded!");

    const $overlay = $('#imageOverlay');
    const $fullImage = $('#fullImage');

    // When a thumbnail is clicked
    $('.gallery img').on('click', function() {
        const src = $(this).attr('src');
        $fullImage.attr('src', src);
        $overlay.addClass('show');
    });

    // Close overlay
    $('.close-btn, #imageOverlay').on('click', function(e) {
        // Only close if clicking background or close button, not the image
        if (e.target !== $fullImage[0]) {
            $overlay.removeClass('show');
        }
    });
});