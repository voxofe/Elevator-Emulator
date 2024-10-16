

// Function to render the floors dynamically
function renderBuildingAndShaft(nFloors, floorHeight, elevatorStartFloor) {

    const building = document.querySelector('.building');
    const shaft = document.querySelector('.shaft');
    const elevator = document.querySelector('.elevator')

    const totalHeight = nFloors * floorHeight; // Total height in pixels
    building.style.height = `${totalHeight}px`;
    shaft.style.height = `${totalHeight}px`;
    elevator.style.marginBottom = `${ (elevatorStartFloor - 1) * 100 + 25}px`;

    building.innerHTML = ''; // Clear existing building and floors

    for (let i = 1; i <= nFloors; i++) {
        
        const floor = document.createElement('div');
        floor.classList.add('floor');
        
        // Create a floor-image div
        const floorImageDiv = document.createElement('div');
        floorImageDiv.classList.add('floor-image');

        // Add the floor number as a span element
        const floorNumberSpan = document.createElement('span');
        floorNumberSpan.classList.add('floor-number'); // Add a class for styling
        floorNumberSpan.innerText = `${i}`; // Set the text

        // Append the number to the floor image div
        floorImageDiv.appendChild(floorNumberSpan);
        floor.appendChild(floorImageDiv);
        building.appendChild(floor);
    }
}

function renderElevatorButtonPanel(nFloors){

    const elevatorButtonPanel = document.querySelector('.elevator-button-panel');
    elevatorButtonPanel.innerHTML = '';

    for (let i = 1; i <= nFloors; i++) {

        const button = document.createElement('button');
        button.classList.add('.elevator-button-panel-buttons');
        button.innerText = `${i}`;
        button.id = `floor-${i}`;
        elevatorButtonPanel.appendChild(button);
    }
}

export {renderBuildingAndShaft, renderElevatorButtonPanel}



