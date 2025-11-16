/* Subject scripts */

$(document).ready(function () {
    console.log("Subjects script loaded!");

    const $modal = $('#appModal');
    const csrftoken = "{{ csrf_token }}";

    // Open document preview
    $('.subject-link').on('click', function () {
        const fileLink = $(this).data('file-link');
        const lower = fileLink.toLowerCase();
        const absUrl = `https://www.mrwang.co.uk${fileLink}`;

        const officeExt = ['.pptx', '.docx', '.xlsx'];
        const isOffice = officeExt.some(ext => lower.endsWith(ext));
        const isPDF = lower.endsWith('.pdf');

        // Only show button if office file or PDF
        if (isOffice || isPDF) {
            // Store file URL on the Generate Quiz button
            $('#generateQuiz').data('file-url', absUrl);
            $('#generateQuiz').show();
        } else {
            $('#generateQuiz').hide();
        }

        if (isOffice) {
            // Office Viewer embed
            const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absUrl)}`;
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', embedUrl);
            $modal.addClass('show');

        } else if (isPDF) {
            // Google Docs Viewer embed for PDFs
            const gview = `https://docs.google.com/gview?url=${encodeURIComponent(absUrl)}&embedded=true`;
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', gview);
            $('#modalLink').attr('href', absUrl); // direct download link
            $modal.addClass('show');

        } else {
            // Everything else: open in new tab
            window.open(absUrl, '_blank');
        }
    });

    // Close modal
    $('.close-modal').on('click', function () {
        $modal.removeClass('show');
        $('#modalPreview').attr('src', ''); // stop embedded content
    });

    // Generate quiz button
    $('#generateQuiz').on('click', function () {
        const fileUrl = $(this).data('file-url');
        const $btn = $(this);
        if (!fileUrl) {
            alert("No file selected to generate quiz from.");
            return;
        }

         // Disable + show spinner
        $btn.prop('disabled', true).addClass('loading').text('Generating...');
    
        // Create a hidden form and submit
        const form = $('<form method="POST" action="/subjects/generate-quiz/"></form>');
        form.append(`<input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">`);
        form.append(`<input type="hidden" name="file_url" value="${fileUrl}">`);
        $('body').append(form);
        form.submit();
    });

});
