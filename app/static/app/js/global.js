/* Global site scripts */

$(document).ready(function(){
    console.log("Global script loaded!");

    const $modal = $('#appModal');

    // Open modal
    $('.grid-button').on('click', function() {
        $('#modalTitle').text($(this).data('app-name'));
        $('#modalDesc').text($(this).data('app-desc'));
        $('#modalImg').attr('src', $(this).data('app-img'));
        $('#modalLink').attr('href', $(this).data('app-link'));

        $modal.addClass('show');
    });

    // Close modal (X button)
    $('.close-modal').on('click', function() {
        $modal.removeClass('show');
    });

    // Close modal by clicking outside
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) {
        $modal.removeClass('show');
        }
    });

});