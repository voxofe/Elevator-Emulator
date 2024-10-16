import {nFloors, elevatorStartFloor, floorHeight} from './app.js'

// Elevator State
let queue = [];
let currentFloor = null;
let targetFloor = null;
let nextFloor = null;
let isMoving = false;
let doorsClosed = true;
const closeDoorsDelay = 3000;  // 3-second delay at each floor from open to closed doors
const speed = 10;  // Elevator movement speed (increase to slow down)


// Function to attach event listeners to elevator buttons
function setupElevatorButtons(nFloors) {
    for (let i = 1; i <= nFloors; i++) {
        const button = document.getElementById(`floor-${i}`);  // Select button by ID
        if (button) {
            button.addEventListener('click', () => {
                addToQueue(i);  // Call addToQueue when the button is clicked
            });
        }
    }
}

// Attach event listeners after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    currentFloor = elevatorStartFloor;  // Initialize the current floor
    console.log(`Elevator starting at floor ${currentFloor}`);

    // After rendering, setup elevator buttons
    setupElevatorButtons(nFloors);
});

// Add a floor request to the queue
function addToQueue(floorRequest) {

    if (floorRequest === currentFloor && !isMoving) {
        console.log(`Already on floor ${floorRequest}, opening doors.`);
        openDoorsAtCurrentFloor();
    } else if (!queue.includes(floorRequest)) {
        console.log(`Floor ${floorRequest} added to the queue.`);
        queue.push(floorRequest);
        processQueue(floorRequest);
    }
}

// Process the queue
function processQueue(floorRequest) {
    if (isMoving || queue.length === 0) return;  // Do nothing if already moving or no requests

    // Set target floor if it has not already been set
    if (!targetFloor) {
        targetFloor = floorRequest;
        console.log(`Target floor: ${targetFloor}`);
        if (!doorsClosed) {
            closeDoors().then(() => {
                moveElevator(); // Start moving after doors are closed
            });
        } else {
            moveElevator();  // Start moving directly if doors are already closed
        }    
    }
}

function moveElevator() {


    // Mark the elevator as moving
    isMoving = true;
    
    nextFloor = targetFloor;// Go straight to target if there are no stops
    const isMovingUp = nextFloor > currentFloor;  // Determine direction

    let currentInterval; // Variable to hold the current interval for elevator movement
    currentInterval = setInterval(() => {

        nextFloor = targetFloor;// Go straight to target if there are no stops
        const isMovingUp = nextFloor > currentFloor;  // Determine direction

        // Real-time check for intermediate stops in the queue while moving
        const floorsInPath = queue.filter(floor => isMovingUp ? (floor > currentFloor && floor < targetFloor) : (floor < currentFloor && floor > targetFloor));
        if (floorsInPath.length > 0) {
            nextFloor = isMovingUp ? Math.min(...floorsInPath) : Math.max(...floorsInPath);  // Get the nearest floor in the direction
            console.log(`Found next floor: ${nextFloor}`)
        }
        
        const elevator = document.querySelector('.elevator');  // Elevator element to animate its movement
        const targetMarginBottom = (nextFloor - 1) * 100 + 25;  // Calculate target position in pixels
        let currentMarginBottom = parseInt(window.getComputedStyle(elevator).marginBottom, 10) || 0; // Get current position

        // If we've reached the target margin (either the main targetFloor or an intermediate nextFloor)
        if ((isMovingUp && currentMarginBottom >= targetMarginBottom) || (!isMovingUp && currentMarginBottom <= targetMarginBottom)) {

            currentFloor = nextFloor;  // Update the current floor
            console.log(`Reached floor ${currentFloor}`);
            queue = queue.filter(floor => floor !== nextFloor);  // Remove the arrived floor from the queue
            
            isMoving = false;  // Mark as no longer moving


            if(currentFloor === targetFloor){
                console.log("Achieved target floor!");
                targetFloor = queue.length ? queue[0] : null;
                clearInterval(currentInterval);  // Stop the interval when the target floor is reached
                openDoorsAtCurrentFloor().then(() => {
                    if(targetFloor){
                        moveElevator();
                    }
                });
            }else {
                console.log("Achieved intermediate floor!")
                clearInterval(currentInterval);  // Stop the interval when the intermediate floor is reached
                openDoorsAtCurrentFloor().then(() => {
                    moveElevator();
                });
            }

            
        } else {
            // Move the elevator 1px at a time
            currentMarginBottom += isMovingUp ? 1 : -1;
            elevator.style.marginBottom = `${currentMarginBottom}px`;
            // currentFloor = (currentMarginBottom - 25) / 100 - 1;
        }

        processQueue();
    }, speed);  // Control the speed of the elevator movement
}




    // const elevator = document.querySelector('.elevator');
    // const targetMarginBottom = (targetFloor - 1) * 100 + 25; // Calculate target position in pixels
    // let currentMarginBottom = parseInt(window.getComputedStyle(elevator).marginBottom, 10) || 0; // Get current position

    // const isMovingUp = targetFloor > currentFloor;  // Determine direction


    // const interval = setInterval(() => {
    //     // Real-time check for intermediate stops in the queue while moving
    //     const floorsInPath = queue.filter(floor => isMovingUp ? (floor > currentFloor && floor <= targetFloor) : (floor < currentFloor && floor >= targetFloor));
    //     if (floorsInPath.length > 0) {
    //         nextFloor = floorsInPath[0];  // Get the nearest floor in the direction
    //         queue = queue.filter(floor => floor !== nextFloor);  // Remove it from queue
    //     }

    //     // If we've reached the target margin (either the main targetFloor or an intermediate nextFloor)
    //     if ((isMovingUp && currentMarginBottom >= targetMarginBottom) || (!isMovingUp && currentMarginBottom <= targetMarginBottom)) {
    //         clearInterval(interval);  // Stop the interval
    //         currentFloor = targetFloor;  // Update the current floor
    //         console.log(`Reached floor ${currentFloor}`);

    //         openDoorsAtCurrentFloor().then(() => {
    //             isMoving = false;  // Mark as no longer moving
    //             if (queue.length > 0) {
    //                 processQueue();  // If there are more floors in the queue, process the next one
    //             }
    //         });
    //     } else {
    //         // Move the elevator 1px at a time
    //         currentMarginBottom += isMovingUp ? 1 : -1;
    //         elevator.style.marginBottom = `${currentMarginBottom}px`;
    //     }
    // }, speed);  // Control the speed of the elevator


// Open the doors at the current floor
function openDoorsAtCurrentFloor() {
    return new Promise((resolve) => {
        console.log(`Opening doors at floor ${currentFloor}`);
        const currentFloorElement = document.querySelector(`.floor:nth-child(${currentFloor}) .floor-image`);
        currentFloorElement.classList.add('open');  // Open doors
        doorsClosed = false;

        // Close the doors after the delay
        setTimeout(() => {
            closeDoors().then(resolve);  // Close doors after delay, then resolve
        }, closeDoorsDelay);
    });
}

// Close the doors
function closeDoors() {
    return new Promise((resolve) => {
        console.log(`Closing doors at floor ${currentFloor}`);
        const currentFloorElement = document.querySelector(`.floor:nth-child(${currentFloor}) .floor-image`);
        currentFloorElement.classList.remove('open');  // Close doors
        doorsClosed = true;
        setTimeout(resolve, 1000);  // Resolve after 1 second for door closing animation
    });
}


// Export the necessary functions
export { addToQueue, currentFloor };
