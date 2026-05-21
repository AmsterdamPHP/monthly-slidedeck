function setupPopSectionEffects() {
    if (window.__popSectionEffectsInitialized || typeof Reveal === 'undefined' || !Reveal.addEventListener) {
        return;
    }
    window.__popSectionEffectsInitialized = true;

    function resolveSectionFromFragment(fragment) {
        if (!fragment || !fragment.classList || !fragment.classList.contains('fx-pop-trigger')) {
            return null;
        }
        return fragment.closest('section.fx-pop-layout');
    }

    Reveal.addEventListener('fragmentshown', function (event) {
        var section = resolveSectionFromFragment(event.fragment);
        if (section) {
            section.classList.add('expanded');
        }
    });

    Reveal.addEventListener('fragmenthidden', function (event) {
        var section = resolveSectionFromFragment(event.fragment);
        if (section) {
            section.classList.remove('expanded');
        }
    });
}

setupPopSectionEffects();
