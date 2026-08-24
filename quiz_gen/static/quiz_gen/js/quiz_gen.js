/* Scripts for quiz generator */

const formsSlides = [
    {
      title: "Your Quiz is now Generating!",
      description: "Please allow up to 60 seconds for your quiz to download.<br>This quick guide will show you how to import your quiz in Microsoft Forms and share it with your class.",
      image: window.formsImages.slide0
    },
    {
      title: "Opening Microsoft Forms (1/4)",
      description: "First, click <a href='https://forms.office.com/' target='_blank'>here</a> to open Microsoft Forms (opens in a new tab).<br>You will need to be signed in to use the site.",
      image: window.formsImages.slide1
    },
    {
      title: "Uploading your Quiz File (2/4)",
      description: "Click 'Quick import' then 'Upload from this device'.<br>Then, select the document which has been downloaded to your device (e.g. 'generated-quiz.docx'). Click 'Quiz' once uploaded.",
      image: window.formsImages.slide2
    },
    {
      title: "Reviewing your Quiz (3/4)",
      description: "Once the file has converted, click 'Start review' to view your quiz.<br>You can check, edit, or add/remove questions and answers here.",
      image: window.formsImages.slide3
    },
    {
      title: "Sharing your Quiz (4/4)",
      description: "Click on 'Collect responses' to share your quiz.<br>You can share by link, email, or QR code.",
      image: window.formsImages.slide4
    },
];
let formsSlide = 0

function updateFormsSlide() {
    $('#modalTitle').html(formsSlides[formsSlide].title);
    $('#modalDesc').html(formsSlides[formsSlide].description);
    $('#modalImg').attr('src', formsSlides[formsSlide].image);
    if (formsSlide == 0) {
        $('#forms-previous-slide').hide();
    } else if (formsSlide == (formsSlides.length - 1)) {
        $('#forms-next-slide').hide();
    } else {
        $('#forms-previous-slide').show();
        $('#forms-next-slide').show();
    }
}


const blooketSlides = [
    {
        title: "Your Blooket Quiz is now Generating!",
        description: "Please allow up to 60 seconds for your quiz to download.<br>This quick guide will show you how to import your quiz into Blooket.",
        image: window.blooketImages.slide0
    },
    {
        title: "Opening Blooket (1/5)",
        description: "First, click <a href='https://www.blooket.com/' target='_blank'>here</a> to open Blooket (opens in a new tab).<br>You will need to be signed in to use the site.",
        image: window.blooketImages.slide1
    },
    {
        title: "Creating a Question Set (2/5)",
        description: "Click <strong>Create</strong> and select <strong>CSV Upload</strong>.",
        image: window.blooketImages.slide2
    },
    {
        title: "Uploading your Quiz (3/5)",
        description: "Enter the details for your question set and click <strong>Create Set</strong>.",
        image: window.blooketImages.slide3
    },
    {
        title: "Importing your Questions (4/5)",
        description: "Click <strong>Upload CSV</strong> and select the Blooket CSV file which has been downloaded to your device. Blooket will import the questions and answers into your question set.",
        image: window.blooketImages.slide4
    },
    {
        title: "Save your Set (5/5)",
        description: "Check the imported questions and click <strong>Save Set</strong> when you are done. You should now see your question set in your account!",
        image: window.blooketImages.slide5
    }
];
let blooketSlide = 0;

function updateBlooketSlide() {
    $('#blooketModalTitle').html(
        blooketSlides[blooketSlide].title
    );
    $('#blooketModalDesc').html(
        blooketSlides[blooketSlide].description
    );
    $('#blooketModalImg').attr(
        'src',
        blooketSlides[blooketSlide].image
    );
    if (blooketSlide == 0) {
        $('#blooket-previous-slide').hide();
    } else {
        $('#blooket-previous-slide').show();
    }
    if (blooketSlide == blooketSlides.length - 1) {
        $('#blooket-next-slide').hide();
    } else {
        $('#blooket-next-slide').show();
    }
}


$(document).ready(function(){
    console.log("Quiz_gen script loaded!");

    let open = false;
    const $modal = $('#appModal');

    // Open more quiz options
    $('#more-options').on('click', function() {
        $('.collapsable').slideToggle();
        if (open) {
            open = false;
            $(this).html("&darr; More options &darr;");
        } else {
            open = true;
            $(this).html("&uarr; Hide options &uarr;");
        }
    });

    // Open quiz type modal
    $('#generate-quiz').on('click', function() {

        $('#quiz-type').show();

        $('#forms-quiz').hide();
        $('#worksheet-quiz').hide();
        $('#presentation-quiz').hide();
        $('#blooket-quiz').hide();

        formsSlide = 0;
        blooketSlide = 0;

        updateFormsSlide();
        updateBlooketSlide();

        $modal.addClass('show');
    });

    // Use as Forms
    $('#use-as-forms').on('click', function () {
        $('#quiz_type_field').val('forms'); // Pass into views
        $('form').submit(); // Submit form using hidden input
        $('#quiz-type').fadeOut(300, function () {
            $('#forms-quiz').fadeIn(300);
        });
    });

    // Use as Worksheet
    $('#use-as-worksheet').on('click', function () {
        $('#quiz_type_field').val('worksheet');
        $('form').submit();
        $('#quiz-type').fadeOut(300, function () {
            $('#worksheet-quiz').fadeIn(300);
        });
    });

    // Use as Presentation
    $('#use-as-presentation').on('click', function () {
        $('#quiz_type_field').val('presentation');
        $('form').submit();
        $('#quiz-type').fadeOut(300, function () {
            $('#presentation-quiz').fadeIn(300);
        });
    });

    // Use as Blooket
    $('#use-as-blooket').on('click', function () {

        // Blooket only supports up to 4 choices
        const choices = parseInt($('input[name="no_of_choices"]').val());
        if (choices > 4) {
            alert("Blooket supports a maximum of 4 answer choices. Please reduce the number of choices before generating your quiz.");
            return;
        }

        $('#quiz_type_field').val('blooket');
        $('form').submit();
        $('#quiz-type').fadeOut(300, function () {
            $('#blooket-quiz').fadeIn(300);
        });

    });

    // Forms slide navigation
    $('#forms-previous-slide').on('click', function () {
        formsSlide--;
        updateFormsSlide();
    });
    $('#forms-next-slide').on('click', function () {
        formsSlide++;
        updateFormsSlide();
    });

    // Blooket slide navigation
    $('#blooket-previous-slide').on('click', function () {
        blooketSlide--;
        updateBlooketSlide();
    });
    $('#blooket-next-slide').on('click', function () {
        blooketSlide++;
        updateBlooketSlide();
    });


    // Drag-drop box for uploading files
    const $dropZone = $("#drop-zone");
    const $fileInput = $dropZone.find("input[type='file']");
    const $fileNameDisplay = $("#file-name");

    function updateFileName() {
        const files = $fileInput[0].files;
        if (files.length > 0) {
        $fileNameDisplay.text("Selected file: " + files[0].name);
        } else {
        $fileNameDisplay.text("");
        }
    }

    $dropZone.on("dragenter dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $dropZone.addClass("dragover");
    });

    $dropZone.on("dragleave drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $dropZone.removeClass("dragover");
    });

    $dropZone.on("drop", function (e) {
        const files = e.originalEvent.dataTransfer.files;
        $fileInput[0].files = files;
        updateFileName();
    });

    $fileInput.on("change", updateFileName);

});