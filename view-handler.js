document.querySelectorAll('.link-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const buttonId = event.target.id; // e.g., "character-sheet-btn"
        const viewId = buttonId.replace('-btn', '-view'); // → "character-sheet-view"

        const views = document.querySelectorAll('div.view');
        const buttons = document.querySelectorAll('.link-button');

        // Toggle button highlight
        buttons.forEach(btn => {
            if (btn.id === buttonId) {
                btn.classList.add('textShadowAnimation');
            } else {
                btn.classList.remove('textShadowAnimation');
            }
        });

        // Toggle view visibility
        views.forEach(view => {
            if (view.id === viewId) {
                view.style.display = '';
            } else {
                view.style.display = 'none';
            }
        });
    });
});
