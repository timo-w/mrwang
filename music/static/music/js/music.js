/* Scripts for music page */

$(document).ready(function(){
    console.log("Music script loaded!");

    const $modal = $('#appModal');

    // Open modal
    $('.grid-button').on('click', function () {
        let name = $(this).data('composition-name');
        let desc = $(this).data('composition-desc');
        let video = $(this).data('composition-vid');
        let score = $(this).data('composition-score');

        // Update modal
        $('#modalTitle').text(name);
        $('#modalDesc').text(desc);

        // YouTube embed
        $('#modalVideo').attr('src', video);

        // Show or hide score link
        if (score) {
            $('#modalLink').attr('href', score).show();
        } else {
            $('#modalLink').hide();
        }

        $modal.addClass('show');
    });

    // Close modal
    $('.close-modal').on('click', function() {
        $('#modalVideo').attr('src', ''); // reset video to stop playback
    });
});