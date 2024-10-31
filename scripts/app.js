import {renderBuildingAndShaft, renderElevatorButtonPanel} from './render.js'

//Main state keeper
let nFloors = 7; 
const floorHeight = 100; 
const elevatorStartFloor = Math.floor(Math.random() * nFloors) + 1;


document.addEventListener('DOMContentLoaded', () => {
    // Initial rendering
    renderBuildingAndShaft(nFloors, floorHeight, elevatorStartFloor);
    renderElevatorButtonPanel(nFloors);
});

//Function to set the number of floors
function setFloors(num) {
    nFloors = num;
    renderBuildingAndShaft();
    renderElevatorButtonPanel();
}

// Export the functions and variables
export { setFloors, nFloors, elevatorStartFloor, floorHeight };