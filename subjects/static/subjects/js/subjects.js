/* Subject scripts */

$(document).ready(function () {
    console.log("Subjects script loaded!");

    $('.subject-link').on('click', function () {

        const fileLink = $(this).data('file-link');
        const lower = fileLink.toLowerCase();
    
        const officeExt = ['.pptx', '.docx', '.xlsx'];
        const isOffice = officeExt.some(ext => lower.endsWith(ext));
        const isPDF = lower.endsWith('.pdf');
    
        if (isOffice) {
            // Office Viewer
            const absUrl = `https://www.mrwang.co.uk${fileLink}`;
            const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${absUrl}`;
            
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', embedUrl);
            $('#appModal').addClass('show');
    
        } else if (isPDF) {
            const absUrl = `https://www.mrwang.co.uk/media-preview/${fileLink.replace('/media/', '')}`;
        
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', absUrl);
            $('#appModal').addClass('show');
            console.log(absUrl);
            
        } else {
            // Everything else: open in new tab
            window.open(fileLink, '_blank');
        }
    });    

});
