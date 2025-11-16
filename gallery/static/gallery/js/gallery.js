/* Scripts for gallery page */

$(document).ready(function(){
    console.log("Photography script loaded!");

    const $overlay = $('#imageOverlay');
    const $fullImage = $('#fullImage');
    const locationBox = $('#photoLocationText');

    // When a thumbnail is clicked (now using data-full)
    $('.gallery').on('click', 'img', function() {
        const fullUrl = $(this).data('full');   // full-size image URL
        const locationText = $(this).data('location');
        $fullImage.attr('src', fullUrl);
        locationBox.text(locationText ? locationText : '');
        $overlay.addClass('show');
    });

    // Close overlay
    $('.close-btn, #imageOverlay').on('click', function(e) {
        // Only close if clicking background or close button, not the image itself
        if (e.target !== $fullImage[0]) {
            $overlay.removeClass('show');
            fullImage.attr('src', '');
            locationBox.text('');
        }
    });
});