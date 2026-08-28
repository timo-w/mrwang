/* Global site scripts */

$(document).ready(function(){
    console.log("Global script loaded!");

    const $modal = $('#appModal');

    // Open modal
    $('.grid-button').on('click', function() {
        $('#modalTitle').text($(this).data('app-name'));
        $('#modalDesc').text($(this).data('app-desc'));
        $('#modalImg').attr('src', $(this).data('app-img'));
        $('#modalLink').attr('href', $(this).data('app-link'));

        $modal.addClass('show');
    });

    // Close modal (X button)
    $('.close-modal').on('click', function() {
        $modal.removeClass('show');
    });

    // Close modal by clicking outside
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) {
        $modal.removeClass('show');
        }
    });

    // Burger menu (mobile)
    $('.nav-toggle').on('click', function() {
        $('.nav-links').toggleClass('show');
    });

    // Colour grid buttons according to content
    $('.grid-button').each(function () {
        const title = $(this).text().trim();

        const colours = generateColours(title);

        $(this).css({
            '--button-colour-1': colours.colour1,
            '--button-colour-2': colours.colour2
        });
    });

});


// Grid button colour generator
function stringToSeed(string) {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash) + string.charCodeAt(i);
        hash |= 0;
    }

    return Math.abs(hash);
}

function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateColours(title) {
    const seed = stringToSeed(title);

    // Base hue: 0–359
    const hue1 = Math.floor(seededRandom(seed) * 360);

    // Choose a complementary/near-complementary relationship.
    // This varies between roughly 150° and 180°.
    const hueOffset = 150 + Math.floor(seededRandom(seed + 1) * 31);
    const hue2 = (hue1 + hueOffset) % 360;

    const saturation1 = 80 + Math.floor(seededRandom(seed + 2) * 16);
    const saturation2 = 80 + Math.floor(seededRandom(seed + 3) * 16);

    const lightness1 = 65 + Math.floor(seededRandom(seed + 4) * 10);
    const lightness2 = 65 + Math.floor(seededRandom(seed + 5) * 10);

    return {
        colour1: `hsl(${hue1}, ${saturation1}%, ${lightness1}%)`,
        colour2: `hsl(${hue2}, ${saturation2}%, ${lightness2}%)`
    };
}