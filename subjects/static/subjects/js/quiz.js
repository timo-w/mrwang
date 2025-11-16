// Scripts for submitting generated quiz

function submitQuiz() {
    const $questions = $('.quiz-question');
    let correct = 0;

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

        if ($selected.length === 0) {
            // Unanswered
            $q.addClass('no-answer');
            $correctLi.addClass('correct-answer');
            return;
        }

        if ($selected.val() === correctAnswer) {
            // Correct
            correct++;
            $q.addClass('correct-answer');
            $selected.closest('li').addClass('correct-answer');
        } else {
            // Incorrect
            $q.addClass('incorrect-answer');
            $selected.closest('li').addClass('incorrect-answer');
            $correctLi.addClass('correct-answer');
        }
    });

    $('#quizResult').text(`You scored ${correct} out of ${$questions.length}`);
}