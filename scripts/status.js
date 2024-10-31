// Function to update the status of the elevator
function updateElevatorStatus(targetFloor, nextFloor, queue) {
    const targetFloorDisplay = document.getElementById('target-floor-display');
    const nextFloorDisplay = document.getElementById('next-floor-display');
    const queueDisplay = document.getElementById('queue-display');

    // Update the target floor display
    targetFloorDisplay.textContent = targetFloor ? targetFloor : '-';

    // Update the next floor display
    nextFloorDisplay.textContent = nextFloor ? nextFloor : '-';

    // Update the queue display
    queueDisplay.textContent = queue.length > 0 ? queue.join(', ') : '-';
}


export { updateElevatorStatus };
