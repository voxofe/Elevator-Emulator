// Highlight the button when a floor is added to the queue
function highlightButton(floor) {
    const button = document.getElementById(`floor-${floor}`);
    button.classList.add('active');  // Add the active class to give a red outline
}

// Reset the button when the floor is reached
function resetButton(floor) {
    const button = document.getElementById(`floor-${floor}`);
    button.classList.remove('active');  // Remove the active class to reset the button style
}

export {highlightButton, resetButton}