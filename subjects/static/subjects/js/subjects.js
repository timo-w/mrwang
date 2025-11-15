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
            const absUrl = encodeURIComponent(`https://www.mrwang.co.uk${fileLink}`);
            const gview = `https://docs.google.com/gview?url=${absUrl}&embedded=true`;
        
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', gview);
            $('#modalLink').attr('href', absUrl);
            $('#appModal').addClass('show');
        } else {
            // Everything else: open in new tab
            window.open(fileLink, '_blank');
        }
    });    

});
