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
        // Highlight VB
        $("#sortableLines .sortable-item code").each(function () {
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
        const $lines = $container.find(".code-line");

        // ---------------------------
        // Helper functions
        // ---------------------------
        function tokenizeLine(clean) {
            // Match string literals, multi-char operators, identifiers, punctuation, whitespace, fallback
            return clean.match(/"[^"]*"|<=|>=|==|<>|!=|[A-Za-z0-9_.]+|[()\[\],.:&+*/%-]|\s+|./g) || [];
        }

        function escapeAttr(s) {
            return String(s)
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        // ---------------------------
        // Collect all blankable positions
        // ---------------------------
        const wordPositions = [];

        // Tokens to not choose as blanks
        const skipTokens = new Set(['&', 'amp', 'lt', 'gt', ';', '(', ')', ',']);

        $lines.each(function (lineIndex) {
            const clean = $(this).html().replace(/<\/?[^>]+>/g, '');
            const tokens = tokenizeLine(clean);

            for (let ti = 0; ti < tokens.length; ti++) {
                const tok = tokens[ti];
                if (!tok || /^\s+$/.test(tok)) continue; // skip whitespace
                if (/^".*"$/.test(tok)) continue; // skip string literals
                if (skipTokens.has(tok)) continue; // skip specific tokens
                wordPositions.push({ lineIndex, tokenIndex: ti, original: tok });
            }
        });

        // ---------------------------
        // Select blanks with adjacency constraint
        // ---------------------------
        const chosen = [];
        const chosenByLine = {}; // track blanks per line

        const blanksCount = Math.min(wordPositions.length, Math.floor(Math.random() * 4) + 1);

        while (chosen.length < blanksCount && wordPositions.length > 0) {
            const idx = Math.floor(Math.random() * wordPositions.length);
            const candidate = wordPositions[idx];
            const line = candidate.lineIndex;
            const token = candidate.tokenIndex;

            if (!chosenByLine[line]) chosenByLine[line] = [];

            // Skip if adjacent token is already chosen
            const adjacent = chosenByLine[line].some(ti => Math.abs(ti - token) === 1);
            if (adjacent) continue;

            chosen.push(idx);
            chosenByLine[line].push(token);
        }

        // ---------------------------
        // Replace chosen tokens with inputs
        // ---------------------------
        const placeholderMap = {};
        let placeholderCounter = 0;

        $lines.each(function (lineIndex) {
            const $line = $(this);
            const clean = $line.html().replace(/<\/?[^>]+>/g, '');
            let tokens = tokenizeLine(clean);

            const blanksOnThisLine = (chosenByLine[lineIndex] || []).map(ti => {
                const wp = wordPositions.find(wp => wp.lineIndex === lineIndex && wp.tokenIndex === ti);
                return wp ? { tokenIndex: ti, original: wp.original } : null;
            }).filter(Boolean);

            if (blanksOnThisLine.length === 0) {
                $line.html(highlightVB(clean));
                return;
            }

            // Sort descending to replace safely
            blanksOnThisLine.sort((a,b)=>b.tokenIndex - a.tokenIndex);

            blanksOnThisLine.forEach(b => {
                const ti = b.tokenIndex;
                const ph = `__BLANK_${placeholderCounter++}__`;
                const answer = b.original;
                const size = Math.max(String(answer).length, 3);
                const inputHtml = `<input type="text" class="blank-input" data-answer="${escapeAttr(answer)}" size="${size}">`;
                placeholderMap[ph] = inputHtml;
                tokens[ti] = ph;
            });

            // Highlight text with placeholders
            let textWithPlaceholders = tokens.join("");
            let highlighted = highlightVB(textWithPlaceholders);

            // Replace placeholders with input HTML
            for (const ph in placeholderMap) {
                highlighted = highlighted.split(ph).join(placeholderMap[ph]);
            }

            $line.html(highlighted);
        });

        // ---------------------------
        // Check / Show answers
        // ---------------------------
        $("#checkButton").on("click", function () {
            let allCorrect = true;

            $(".blank-input").each(function () {
                const user = String($(this).val() || "").trim();
                const correct = String($(this).attr("data-answer") || "").trim();
                if (user.toLowerCase() === correct.toLowerCase()) {
                    $(this).addClass("blank-correct").removeClass("blank-wrong");
                } else {
                    $(this).addClass("blank-wrong").removeClass("blank-correct");
                    allCorrect = false;
                }
            });

            if (allCorrect) {
                $("#resultMessage").html("<b style='color: green;'>All correct!</b>");
                $("#checkButton").hide();
                $("#showCorrect").hide();
                confetti({ particleCount: 100, angle: 90, spread: 100, origin: { x: 0.5, y: 1 } });
            } else {
                $("#resultMessage").html("<b style='color: red;'>Not quite, try again.</b>");
                $("#showCorrect").show();
                $("#fillBlanks").addClass("incorrect-shake");
                setTimeout(() => $("#fillBlanks").removeClass("incorrect-shake"), 400);
            }
        });

        $("#showCorrect").on("click", function () {
            $(".blank-input").each(function () {
                const answer = String($(this).attr("data-answer") || "");
                $(this).val(answer).addClass("blank-correct").removeClass("blank-wrong");
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
