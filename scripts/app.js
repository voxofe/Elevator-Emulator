import {renderBuildingAndShaft, renderElevatorButtonPanel} from './render.js'

//Main state keeper
let nFloors = 7; 
const floorHeight = 100; 
const elevatorStartFloor = Math.floor(Math.random() * nFloors) + 1;


document.addEventListener('DOMContentLoaded', () => {
    // Initial rendering
    renderBuildingAndShaft(nFloors, floorHeight, elevatorStartFloor);
    renderElevatorButtonPanel(nFloors);
    console.log("Inside initial render!")
});

//Function to set the number of floors
function setFloors(num) {
    nFloors = num;
    renderBuildingAndShaft(nFloors, floorHeight, 1);
    renderElevatorButtonPanel(nFloors);
    console.log("Inside floor number change render!")
}

function getFloors() {
    return nFloors;
}

export { setFloors, getFloors, nFloors, elevatorStartFloor, floorHeight };