//  Drag/drop puzzle behaviour scripts


$(document).ready(function () {

    console.log("Play puzzle script loaded!");
    

    const $sortable = $("#sortableLines");
    const $checkButton = $("#checkButton");
    const $resultMessage = $("#resultMessage");

    // Shuffle the list items
    if ($sortable.length && $sortable.children().length > 0) {
        const items = $sortable.children().toArray();

        // Fisher-Yates shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = items[i];
            items[i] = items[j];
            items[j] = tmp;
        }

        $sortable.empty();
        items.forEach(it => $sortable.append(it));
    }

    // Now Sortable
    if ($sortable.length) {
        new Sortable($sortable[0], { animation: 150 });
    }

    // Check button
    $checkButton.on("click", function () {
        const userOrder = $("#sortableLines .sortable-item")
            .map(function () {
                return parseInt($(this).data("line-number"));
            })
            .get();

        const correctOrder = [...userOrder].slice().sort((a, b) => a - b);

        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

        if (isCorrect) {
            $resultMessage.html("<b style='color: green;'>Correct!</b>");
            $("#showCorrect").hide();
        } else {
            $resultMessage.html("<b style='color: red;'>Not correct. Try again!</b>");
            $("#showCorrect").show();   // reveal the button
        }
    });

    // Show correct order
    $("#showCorrect").on("click", function () {
        const $list = $("#sortableLines");

        // Sort DOM nodes by line_number
        const sortedItems = $list.children(".sortable-item")
            .toArray()
            .sort((a, b) => {
                const A = parseInt($(a).data("line-number"));
                const B = parseInt($(b).data("line-number"));
                return A - B;
            });

        // Replace with the correct order
        $list.empty();
        sortedItems.forEach(item => $list.append(item));

        $resultMessage.html("<b style='color: blue;'>Correct order shown.</b>");

        // Hide button so they can't re-click
        $("#showCorrect").hide();
    });

    // Prev / Next navigation handlers
    function goToIndex(i) {
        if (typeof PROGRAM_COUNT !== "undefined" && PROGRAM_COUNT > 0) {
            i = (i + PROGRAM_COUNT) % PROGRAM_COUNT;
        }

        const url = new URL(window.location.href);
        url.searchParams.set("i", i);

        if (typeof TOPIC !== "undefined" && TOPIC) {
            url.searchParams.set("topic", TOPIC);
        } else {
            url.searchParams.delete("topic");
        }

        window.location.href = url.toString();
    }

    $("#prevProgram").on("click", function () {
        goToIndex(CURRENT_INDEX - 1);
    });

    $("#nextProgram").on("click", function () {
        goToIndex(CURRENT_INDEX + 1);
    });

});
