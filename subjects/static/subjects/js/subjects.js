/* Global site scripts */

$(document).ready(function(){
    console.log("Subjects script loaded!");

    const $modal = $('#appModal');

    // Open modal
    $('.subject-link').on('click', function() {
        $('#modalName').text($(this).data('file-name'));
        let src = `https://view.officeapps.live.com/op/embed.aspx?src=https://www.mrwang.co.uk${$(this).data('file-link')}`
        $('#modalPreview').attr('src', src);
        $modal.addClass('show');
    });


});