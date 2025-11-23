//  Drag/drop puzzle behaviour scripts


$(document).ready(function () {

    console.log("Play puzzle script loaded!");
    
    const $resultMessage = $("#resultMessage");
    const $checkButton = $("#checkButton");
    const $showCorrect = $("#showCorrect");

    // -----------------------------
    // Reorder Puzzle Setup
    // -----------------------------
    if (PUZZLE_TYPE === "reorder") {

        const $sortable = $("#sortableLines");

        if ($sortable.length && $sortable.children().length > 0) {
            const items = $sortable.children().toArray();

            // Fisher-Yates shuffle
            for (let i = items.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [items[i], items[j]] = [items[j], items[i]];
            }

            $sortable.empty();
            items.forEach(it => $sortable.append(it));
        }

        // Apply VB syntax highlighting
        $("#sortableLines code").each(function () {
            const raw = $(this).text();
            $(this).html(highlightVB(raw));
        });

        // Enable SortableJS
        if ($sortable.length) {
            new Sortable($sortable[0], { animation: 150 });
        }

        // Check order button
        $checkButton.on("click", function (e) {
            e.preventDefault();
            const userOrder = $("#sortableLines .sortable-item")
                .map(function () { return parseInt($(this).data("line-number")); })
                .get();

            const correctOrder = [...userOrder].slice().sort((a, b) => a - b);
            const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

            if (isCorrect) {
                $resultMessage.html("<b style='color: green;'>Correct!</b>");
                $showCorrect.hide();
                $checkButton.hide();
                confetti({ particleCount: 100, angle: 90, spread: 100, origin: { x: 0.5, y: 1 } });
                $("#sortableLines .sortable-item").each(function () {
                    $(this).addClass("correct-line");
                    setTimeout(() => $(this).removeClass("correct-line"), 1000);
                });
            } else {
                $resultMessage.html("<b style='color: red;'>Not correct. Try again!</b>");
                $showCorrect.show();
                $("#sortableLines").addClass("incorrect-shake");
                setTimeout(() => $("#sortableLines").removeClass("incorrect-shake"), 400);
            }
        });

        // Show correct order
        $showCorrect.on("click", function () {
            const $list = $("#sortableLines");
            const sortedItems = $list.children(".sortable-item")
                .toArray()
                .sort((a, b) => parseInt($(a).data("line-number")) - parseInt($(b).data("line-number")));
            $list.empty();
            sortedItems.forEach(item => $list.append(item));
            $resultMessage.html("<b style='color: blue;'>Correct order shown.</b>");
            $showCorrect.hide();
            $checkButton.hide();
        });
    }

    // -----------------------------
    // Fill-in-the-blank Puzzle Setup
    // -----------------------------
    else if (PUZZLE_TYPE === "fill_blank") {

        const $container = $("#fillBlanks");
        const lines = $container.find(".code-line");

        // Collect all word positions
        const wordPositions = [];

        $container.find(".code-line").each(function (lineIndex) {
            let text = $(this).text();
            const words = text.split(/(\s+)/);

            let insideString = false; // state machine: inside " ... " ?

            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                const w = words[wordIndex];

                // Count quotes in this chunk
                const quoteCount = (w.match(/"/g) || []).length;

                // If we are currently outside a string, this word is blankable
                // only if it contains no quotes that *start* a literal.
                if (!insideString && quoteCount === 0 && w.trim()) {
                    wordPositions.push({ lineIndex, wordIndex, originalWord: w });
                }

                // Flip inside/outside when passing quotes
                // If quoteCount is odd, we toggle the state.
                if (quoteCount % 2 === 1) {
                    insideString = !insideString;
                }
            }
        });

        // Pick 1 or 2 blanks for the whole program
        const blanksCount = Math.min(wordPositions.length, Math.floor(Math.random() * 4) + 1);
        const chosen = [];
        while (chosen.length < blanksCount) {
            const idx = Math.floor(Math.random() * wordPositions.length);
            if (!chosen.includes(idx)) chosen.push(idx);
        }

        // Apply blanks
        chosen.forEach(i => {
            const { lineIndex, wordIndex } = wordPositions[i];
            const $line = lines.eq(lineIndex);

            // Split preserving whitespace
            const words = $line.text().split(/(\s+)/);

            let raw = words[wordIndex];

            const match = raw.match(/^([A-Za-z0-9_]+)(.*)$/);

            if (match) {
                const core = match[1];
                const tail = match[2];

                words[wordIndex] =
                    `<input type="text"
                        class="blank-input"
                        data-answer="${core}"
                        size="${Math.max(core.length, 3)}">` + tail;

            } else {
                words[wordIndex] =
                    `<input type="text"
                        class="blank-input"
                        data-answer="${raw}"
                        size="${Math.max(raw.length, 3)}">`;
            }

            // Update line HTML
            $line.html(words.join(""));

            // Highlight lines which have inputs
            const highlighted = highlightVB($line.html());
            $line.html(highlighted);
        });
        // Apply VB syntax highlighting for rest of code
        $("#fillBlanks code").each(function () {
            const raw = $(this).text();
            $(this).html(highlightVB(raw));
        });
2
        $("#checkButton").on("click", function () {
            let allCorrect = true;

            $(".blank-input").each(function () {
                const user = $(this).val().trim();
                const correct = $(this).data("answer");

                if (user.toLowerCase() === correct.toLowerCase()) {
                    $(this).addClass("blank-correct");
                    $(this).removeClass("blank-wrong");
                } else {
                    $(this).addClass("blank-wrong");
                    $(this).removeClass("blank-correct");
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                $("#resultMessage").html("<b style='color: green;'>All correct!</b>");
                $("#checkButton").hide();
                $("#showCorrect").hide();
                // Confetti effect
                confetti({ particleCount: 100, angle: 90, spread: 100, origin: { x: 0.5, y: 1 } });
            } else {
                $("#resultMessage").html("<b style='color: red;'>Not quite, try again.</b>");
                $("#showCorrect").show();
                // Shake effect
                $("#fillBlanks").addClass("incorrect-shake");
                setTimeout(() => $("#fillBlanks").removeClass("incorrect-shake"), 400);
            }
        });

        // Show answers
        $("#showCorrect").on("click", function () {
            $(".blank-input").each(function () {
                const answer = $(this).data("answer");
                $(this).val(answer);
                $(this).addClass("blank-correct");
                $(this).removeClass("blank-wrong");
            });

            $("#resultMessage").html("<b style='color: blue;'>Answers shown.</b>");
            $("#checkButton").hide();
            $("#showCorrect").hide();
        });

    }

    // -----------------------------
    // Program Navigation
    // -----------------------------
    function goToIndex(i) {
        if (PROGRAM_COUNT > 0) i = (i + PROGRAM_COUNT) % PROGRAM_COUNT;
        const url = new URL(window.location.href);
        url.searchParams.set("i", i);
        if (TOPIC) url.searchParams.set("topic", TOPIC);
        else url.searchParams.delete("topic");
        window.location.href = url.toString();
    }

    $("#randomProgram").on("click", function () {
        if (PROGRAM_COUNT === 0) return;
        let rand = Math.floor(Math.random() * PROGRAM_COUNT);
        if (PROGRAM_COUNT > 1 && rand === CURRENT_INDEX) rand = (rand + 1) % PROGRAM_COUNT;
        goToIndex(rand);
    });

    $("#prevProgram").on("click", function () { goToIndex(CURRENT_INDEX - 1); });
    $("#nextProgram").on("click", function () { goToIndex(CURRENT_INDEX + 1); });

});
