/* Subject scripts */

$(document).ready(function () {
    console.log("Subjects script loaded!");

    const $modal = $('#appModal');
    const csrftoken = "{{ csrf_token }}";  // make sure your template sets this

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
        if (!fileUrl) {
            alert("No file selected to generate quiz from.");
            return;
        }

        $(this).prop('disabled', true).text('Generating...');

        $.ajax({
            url: "/subjects/generate-quiz-from-file/",
            method: "POST",
            data: {
                file_url: fileUrl,
                csrfmiddlewaretoken: csrftoken
            },
            xhrFields: { responseType: 'blob' },
            success: function (data, status, xhr) {
                // Extract filename from header
                let filename = "generated-quiz.docx";
                const disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('filename=') !== -1) {
                    filename = disposition.split('filename=')[1].replace(/"/g, '');
                }

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                alert("Error generating quiz. Check console for details.");
            },
            complete: function () {
                $('#generateQuiz').prop('disabled', false).text('Generate Quiz');
            }
        });
    });

});
