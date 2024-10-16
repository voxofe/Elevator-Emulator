
import { setFloors, getFloors } from './render.js';

const floorInput = document.getElementById('floor-input');
const addFloorBtn = document.getElementById('add-floor');
const removeFloorBtn = document.getElementById('remove-floor');

//Add a floor
addFloorBtn.addEventListener('click', () => {
    const currentFloors = getFloors();
    setFloors(currentFloors + 1); // Use the setter function
    floorInput.value = currentFloors + 1; // Update input display
});

// Remove a floor
removeFloorBtn.addEventListener('click', () => {
    const currentFloors = getFloors();
    if (currentFloors > 1) {
        setFloors(currentFloors - 1); // Use the setter function
        floorInput.value = currentFloors - 1; // Update input display
    }
})

// Update the number of floors when the input changes
floorInput.addEventListener('change', () => {
    const newFloorCount = parseInt(floorInput.value);
    if (newFloorCount >= 1) {
        setFloors(newFloorCount); // Use the setter function
    }
});