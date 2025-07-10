// Save workout plans to localStorage
document.querySelectorAll('textarea').forEach(textarea => {
    // Load saved content
    const day = textarea.parentElement.getAttribute('data-day');
    const savedContent = localStorage.getItem(`workout-${day}`);
    if (savedContent) {
        textarea.value = savedContent;
    }

    // Save content when changed
    textarea.addEventListener('input', () => {
        localStorage.setItem(`workout-${day}`, textarea.value);
    });
});

// Handle color selection
document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
        const color = e.target.getAttribute('data-color');
        const card = e.target.closest('.card');
        
        // Remove all color classes
        card.classList.remove('white', 'red', 'green', 'blue');
        
        // Add the selected color class
        card.classList.add(color);
        
        // Save the color preference
        const day = card.getAttribute('data-day');
        localStorage.setItem(`color-${day}`, color);
    });
});

// Load saved colors
document.querySelectorAll('.card').forEach(card => {
    const day = card.getAttribute('data-day');
    const savedColor = localStorage.getItem(`color-${day}`);
    if (savedColor) {
        card.classList.add(savedColor);
    }
}); 