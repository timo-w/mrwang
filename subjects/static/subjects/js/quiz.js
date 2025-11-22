// Scripts for submitting generated quiz

console.log("Quiz script loaded!");

// Shared function to attach and trigger the explanation behaviour
function attachExplanation($q, questionText, correctAnswer, userAnswer) {
    const $btn = $q.find('.explain-btn');
    const $box = $q.find('.explanation-box');

    // Reveal explain button
    $btn.show();

    // Ensure only one click binding exists
    $btn.off('click').on('click', function () {
        $box.show().text("Thinking...");

        $.post("/subjects/explain-answer/", {
            question: questionText,
            correct: correctAnswer,
            user_answer: userAnswer,
            csrfmiddlewaretoken: csrftoken,
        })
        .done(function (data) {
            $box.text(data.explanation);
            // $btn.hide();
        })
        .fail(function () {
            $box.text("Sorry, I couldn't generate an explanation.");
        });
    });
}


function submitQuiz() {
    const $questions = $('.quiz-question');
    let correct = 0;

    // Scroll to the top
    $('html, body').animate({ scrollTop: 0 }, 'slow');

    $questions.each(function () {
        const $q = $(this);
        const correctAnswer = $q.data('correct');
        const $selected = $q.find('input[type=radio]:checked');

        // Find label/LI containing the correct answer
        const $correctLi = $q.find('label')
            .filter(function () {
                return $(this).text().trim() === correctAnswer;
            })
            .closest('li');

        // Reset colours
        $q.find('li').css('background', '');

        // Extract question text once here
        const questionText = $q.find('h4').text().replace(/^\d+\.\s*/, '');

        // Case 1: Unanswered
        if ($selected.length === 0) {
            $q.addClass('no-answer');
            $correctLi.addClass('correct-answer');
            attachExplanation($q, questionText, correctAnswer, "");
            return;
        }

        // Case 2: Correct
        if ($selected.val() === correctAnswer) {
            correct++;
            $q.addClass('correct-answer');
            $selected.closest('li').addClass('correct-answer');
            return;
        }

        // Case 3: Incorrect
        $q.addClass('incorrect-answer');
        $selected.closest('li').addClass('incorrect-answer');
        $correctLi.addClass('correct-answer');
        attachExplanation($q, questionText, correctAnswer, $selected.val());
    });

    let percentage = Math.round((correct / $questions.length) * 100);
    $('#quizResult').text(`You scored ${correct} out of ${$questions.length} (${percentage}%).`);

}
