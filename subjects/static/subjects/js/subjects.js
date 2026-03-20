/* Subject scripts */

$(document).ready(function () {
    console.log("Subjects script loaded!");

    const $modal = $('#appModal');

    // Open document preview
    $('.grid-button-small').on('click', function () {
        const filePath = $(this).data('file-path');
        const lower = filePath.toLowerCase();
        const absUrl = `https://www.mrwang.co.uk${filePath}`;

        const officeExt = ['.pptx', '.docx', '.xlsx'];
        const isOffice = officeExt.some(ext => lower.endsWith(ext));
        const isPDF = lower.endsWith('.pdf');

        const lessonText = $(this).text().trim();
        const lessonNumber = lessonText.split(" ")[0];

        // Update URL with lesson number without refreshing
        const newUrl = `${window.location.pathname}?lesson=${lessonNumber}`;
        window.history.replaceState(null, "", newUrl);
        // Store lesson number for copy button
        $('#copyLessonLink').data('lesson', lessonNumber);

        // Get quizzable flag
        const isQuizzable = $(this).data('quizzable') === true || $(this).data('quizzable') === "true";

        // Only show button if file type is supported AND marked as quizzable
        if ((isOffice || isPDF) && isQuizzable) {
            $('#generateQuiz').data('file-path', filePath);
            $('#generateQuiz').show();
        } else {
            $('#generateQuiz').hide();
        }

        if (isOffice) {
            // Office Viewer embed
            const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absUrl)}`;
            
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', embedUrl);

            // Set download link
            $('#modalLink')
                .attr('href', absUrl)
                .attr('download', filePath.split('/').pop());

            $modal.addClass('show');

        } else if (isPDF) {
            // Google Docs Viewer embed for PDFs
            const gview = `https://docs.google.com/gview?url=${encodeURIComponent(absUrl)}&embedded=true`;
            
            $('#modalName').text($(this).data('file-name'));
            $('#modalPreview').attr('src', gview);

            // Set download link
            $('#modalLink')
                .attr('href', absUrl)
                .attr('download', filePath.split('/').pop());

            $modal.addClass('show');

        } else {
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
        const filePath = $(this).data('file-path');
        const $btn = $(this);
        if (!filePath) {
            alert("No file selected to generate quiz from.");
            return;
        }

         // Disable + show spinner
        $btn.prop('disabled', true).addClass('loading').text('Generating...');
    
        // Create a hidden form and submit
        const form = $('<form method="POST" action="/subjects/generate-quiz/"></form>');
        form.append(`<input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">`);
        form.append(`<input type="hidden" name="file_path" value="${filePath}">`);
        $('body').append(form);
        form.submit();
    });


    // Share lesson button
    $('#copyLessonLink').on('click', function () {
        const lesson = $(this).data('lesson');

        if (!lesson) {
            alert("No lesson selected.");
            return;
        }

        const url = `${window.location.origin}${window.location.pathname}?lesson=${lesson}`;

        navigator.clipboard.writeText(url).then(() => {
            const $btn = $(this);
            $btn.text("Link copied to clipboard!");
            setTimeout(() => $btn.text("Share"), 1500);
        });
    });



    // Open page to specific lesson if specified in URL
    const targetLesson = new URLSearchParams(window.location.search).get("lesson");

    if (targetLesson) {
        $(".grid-button-small").each(function () {
            const text = $(this).text().trim();
            const lessonNumber = text.split(" ")[0];

            if (lessonNumber === targetLesson) {
                $(this).trigger("click");
                return false; // stop .each loop
            }
        });
    }

});
