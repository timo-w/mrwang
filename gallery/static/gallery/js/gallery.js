/* Scripts for gallery page */

$(document).ready(function(){
    console.log("Photography script loaded!");

    const $overlay = $('#imageOverlay');
    const $fullImage = $('#fullImage');

    // When a thumbnail is clicked (now using data-full)
    $('.gallery').on('click', 'img', function() {
        const fullUrl = $(this).data('full');   // full-size image URL
        $fullImage.attr('src', fullUrl);
        $overlay.addClass('show');
    });

    // Close overlay
    $('.close-btn, #imageOverlay').on('click', function(e) {
        // Only close if clicking background or close button, not the image itself
        if (e.target !== $fullImage[0]) {
            $overlay.removeClass('show');
        }
    });
});