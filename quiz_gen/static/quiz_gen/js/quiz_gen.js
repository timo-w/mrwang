/* Scripts for quiz generator */

const slides = [
    {
      title: "Opening Microsoft Forms (1/6)",
      description: "First, click <a href='https://forms.office.com/' target='_blank'>here</a> to open Microsoft Forms (opens in a new tab).<br>You will need to be signed in to use the site.",
      image: window.quizImages.slide1
    },
    {
      title: "Uploading the Quiz File (2/6)",
      description: "Click 'Quick import' then 'Upload from this device'.<br>Then, select the document which has been downloaded to your device (e.g. 'generated-quiz.docx').",
      image: window.quizImages.slide2
    },
    {
      title: "Importing the Quiz (3/6)",
      description: "Select 'Quiz' once the file has uploaded.<br>Once the file has converted, click 'Start review' to view your quiz.",
      image: window.quizImages.slide3
    },
    {
      title: "Selecting Correct Answers (4/6)",
      description: "Tick the first (correct) option for each question.<br>Drag the options to randomise their order",
      image: window.quizImages.slide4
    },
    {
      title: "Adding Points (5/6)",
      description: "For each question, assign points (at least 1 point per question).",
      image: window.quizImages.slide5
    },
    {
      title: "Sharing your Quiz (6/6)",
      description: "Give your quiz a name, then click on 'Collect responses' to share your quiz.<br>You can share by link, email, or QR code.",
      image: window.quizImages.slide6
    },
];
let slide = 0

function updateSlide() {
    $('#modalTitle').html(slides[slide].title);
    $('#modalDesc').html(slides[slide].description);
    $('#modalImg').attr('src', slides[slide].image);
    if (slide == 0) {
        $('#previous-slide').hide();
    } else if (slide == (slides.length - 1)) {
        $('#next-slide').hide();
    } else {
        $('#previous-slide').show();
        $('#next-slide').show();
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

    // Open forms guide
    $('#generate-quiz').on('click', function() {
        updateSlide();
        $modal.addClass('show');
    });
    // Slide navigation
    $('#previous-slide').on('click', function () {
        slide--;
        updateSlide();
    });
    $('#next-slide').on('click', function () {
        slide++;
        updateSlide();
    });
});