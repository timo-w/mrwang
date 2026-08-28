/* Quiz Generator Script */

$(document).ready(function () {
    console.log("Quiz_gen script loaded!");

    const $modal = $('#appModal');

    // Instruction slide system

    const slideSets = {
        forms: window.formsImages,
        blooket: window.blooketImages,
        gimkit: window.gimkitImages
    };

    const slides = {
        forms: [
            {
                title: "<a class='generating-text'>Generating quiz</a>",
                description: "Please allow up to 60 seconds for your quiz to download.<br>This quick guide will show you how to import your quiz in Microsoft Forms and share it with your class.",
                image: slideSets.forms.slide0
            },
            {
                title: "Opening Microsoft Forms (1/4)",
                description: "First, click <a href='https://forms.office.com/' target='_blank'>here</a> to open Microsoft Forms. Sign into your account.",
                image: slideSets.forms.slide1
            },
            {
                title: "Uploading your Quiz File (2/4)",
                description: "Click 'Quick import' then 'Upload from this device'. Select your downloaded quiz file.",
                image: slideSets.forms.slide2
            },
            {
                title: "Reviewing your Quiz (3/4)",
                description: "Click 'Start review' to view your quiz.",
                image: slideSets.forms.slide3
            },
            {
                title: "Sharing your Quiz (4/4)",
                description: "Click 'Collect responses' to share your quiz.",
                image: slideSets.forms.slide4
            }
        ],

        blooket: [
            {
                title: "<a class='generating-text'>Generating quiz</a>",
                description: "Please allow up to 60 seconds for your quiz to download.<br>This quick guide will show you how to import your quiz into Blooket.",
                image: slideSets.blooket.slide0
            },
            {
                title: "Opening Blooket (1/5)",
                description: "Click <a href='https://www.blooket.com/' target='_blank'>here</a> to open Blooket. Sign into your account.",
                image: slideSets.blooket.slide1
            },
            {
                title: "Creating a Question Set (2/5)",
                description: "Click <strong>Create</strong> → <strong>CSV Upload</strong>.",
                image: slideSets.blooket.slide2
            },
            {
                title: "Uploading your Quiz (3/5)",
                description: "Enter your set details and click <strong>Create Set</strong>.",
                image: slideSets.blooket.slide3
            },
            {
                title: "Importing your Questions (4/5)",
                description: "Click <strong>Upload CSV</strong> and select your downloaded file.",
                image: slideSets.blooket.slide4
            },
            {
                title: "Save your Set (5/5)",
                description: "Check your questions and click <strong>Save Set</strong>. You will see your quiz in your account!",
                image: slideSets.blooket.slide5
            }
        ],

        gimkit: [
            {
                title: "<a class='generating-text'>Generating quiz</a>",
                description: "Please allow up to 60 seconds for your quiz to download.<br>This quick guide will show you how to import your quiz into Gimkit.",
                image: slideSets.gimkit.slide0
            },
            {
                title: "Opening Gimkit (1/5)",
                description: "Click <a href='https://www.gimkit.com/' target='_blank'>here</a> to open Gimkit. Sign into your account.",
                image: slideSets.gimkit.slide1
            },
            {
                title: "Creating a Question Set (2/5)",
                description: "Click <strong>New Kit</strong> and fill in your quiz details.",
                image: slideSets.gimkit.slide2
            },
            {
                title: "Importing your Quiz (3/5)",
                description: "Click <strong>Import from Spreadsheet</strong>.",
                image: slideSets.gimkit.slide3
            },
            {
                title: "Importing your Quiz (4/5)",
                description: "Click <strong>Upload File</strong> and select your Gimkit CSV.",
                image: slideSets.gimkit.slide4
            },
            {
                title: "Save your Set (5/5)",
                description: "Check your questions and click <strong>All Done</strong>. You will see your quiz in your account!",
                image: slideSets.gimkit.slide5
            }
        ]
    };

    const slideState = {
        forms: 0,
        blooket: 0,
        gimkit: 0
    };

    function updateSlide(type) {
        const slide = slides[type][slideState[type]];

        $(`#${type}ModalTitle`).html(slide.title);
        $(`#${type}ModalDesc`).html(slide.description);
        $(`#${type}ModalImg`).attr("src", slide.image);

        // Previous button
        slideState[type] === 0
            ? $(`#${type}-previous-slide`).hide()
            : $(`#${type}-previous-slide`).show();

        // Next button
        slideState[type] === slides[type].length - 1
            ? $(`#${type}-next-slide`).hide()
            : $(`#${type}-next-slide`).show();
    }


    // Quiz type handler
    function handleQuizType(type, maxChoices = 4) {
        const choices = parseInt($('input[name="no_of_choices"]').val());

        if (choices > maxChoices) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} supports a maximum of ${maxChoices} answer choices.`);
            return;
        }

        $('#quiz_type_field').val(type);
        $('form').submit();

        $('#quiz-type').fadeOut(300, function () {
            $(`#${type}-quiz`).fadeIn(300);
        });
    }


    // Button bindings
    $('#generate-quiz').on('click', function () {

        // Hide all quiz guides
        $('#forms-quiz').hide();
        $('#worksheet-quiz').hide();
        $('#presentation-quiz').hide();
        $('#blooket-quiz').hide();
        $('#gimkit-quiz').hide();

        // Show quiz type selector
        $('#quiz-type').show();

        // Reset slides
        slideState.forms = 0;
        slideState.blooket = 0;
        slideState.gimkit = 0;

        updateSlide("forms");
        updateSlide("blooket");
        updateSlide("gimkit");

        $modal.addClass('show');
    });

    $('#use-as-forms').on('click', () => handleQuizType("forms", 10));
    $('#use-as-worksheet').on('click', () => handleQuizType("worksheet", 10));
    $('#use-as-presentation').on('click', () => handleQuizType("presentation", 10));
    $('#use-as-blooket').on('click', () => handleQuizType("blooket", 4));
    $('#use-as-gimkit').on('click', () => handleQuizType("gimkit", 4));

    // Slide navigation
    ['forms', 'blooket', 'gimkit'].forEach(type => {
        $(`#${type}-previous-slide`).on('click', () => {
            slideState[type]--;
            updateSlide(type);
        });

        $(`#${type}-next-slide`).on('click', () => {
            slideState[type]++;
            updateSlide(type);
        });
    });


    // File upload
    const $dropZone = $("#drop-zone");
    const $fileInput = $dropZone.find("input[type='file']");
    const $fileNameDisplay = $("#file-name");

    function updateFileName() {
        const file = $fileInput[0].files[0];
        $fileNameDisplay.text(file ? `Selected file: ${file.name}` : "");
    }

    $dropZone.on("dragenter dragover", e => {
        e.preventDefault();
        $dropZone.addClass("dragover");
    });

    $dropZone.on("dragleave drop", e => {
        e.preventDefault();
        $dropZone.removeClass("dragover");
    });

    $dropZone.on("drop", e => {
        $fileInput[0].files = e.originalEvent.dataTransfer.files;
        updateFileName();
    });

    $fileInput.on("change", updateFileName);


    // Generating... animation
    let dots = 0;
    setInterval(() => {
        dots = (dots + 1) % 4;
        $(".generating-text").text("Generating quiz" + ".".repeat(dots));
    }, 700);

});
