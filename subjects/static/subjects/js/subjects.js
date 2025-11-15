/* Global site scripts */

$(document).ready(function(){
    console.log("Subjects script loaded!");

    const $modal = $('#appModal');
    let src = "https://view.officeapps.live.com/op/embed.aspx?src=";

    // Open modal
    $('.subject-link').on('click', function() {
        $('#modalName').text($(this).data('file-name'));
        src = `${src}${$(this).data('file-link')}`
        $('#modalPreview').attr('src', src);

        $modal.addClass('show');
    });


});