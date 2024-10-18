import {nFloors, elevatorStartFloor, floorHeight} from './App.js'

import { highlightButton, resetButton } from './beautifulButtons.js';

// Elevator State
let queue = [];
let currentFloor = null;
let targetFloor = null;
let nextFloor = null;
let isMoving = false;
let doorsClosed = true;
let newRequest = false;// Make moveElevator() check for intermediate stops only when there's a new addition to the queue
let afterStop = null; //Check to see if if elevator just made a stop and is about to move again
const closeDoorsDelay = 3000;  // 3-second delay at each floor from open to closed doors
const speed = 20;  // Elevator movement opeed (decrease to speed up)



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
        highlightButton(floorRequest); // Highlight the button with red outline
        newRequest = true;
        processQueue(floorRequest);
    }


}

// Process the queue
function processQueue(floorRequest) {

    // Set target floor if it has not already been set
    if (!targetFloor) {
        targetFloor = floorRequest;
        afterStop = false;
        console.log(`Target floor: ${targetFloor}`);
        

        if (!doorsClosed) {
            closeDoors().then(() => {
                moveElevator(); // Start moving after doors are closed
            });
        } else {
            moveElevator();  // Start moving directly if doors are already closed
        }    
    }else {console.log(`I already have a target. Floor ${floorRequest} was just added to the queue.`)}
}

function getNextStop(isMovingUp, currentMarginBottom, targetMarginBottom){
    const floorsInPath = queue.filter(
        floor => isMovingUp ? 
        ( (floor-1) * 100 + 25 > currentMarginBottom && (floor-1) * 100 + 25 < targetMarginBottom) :
        ( (floor-1) * 100 + 25 < currentMarginBottom && (floor-1) * 100 + 25 > targetMarginBottom)
    );
    if (floorsInPath.length) {
        nextFloor = isMovingUp ? Math.min(...floorsInPath) : Math.max(...floorsInPath);  // Get the nearest floor in the direction
         
        console.log(`Checked intermediate floors: ${floorsInPath} and chose floor ${nextFloor} as next`)  
    }else if(floorsInPath.length === 0 && queue.length > 1){
        console.log(`Already passed floor ${queue.at(-1)}`)
    }
    newRequest = false;
    return nextFloor;
}


function moveElevator() {

    // Mark the elevator as moving
    isMoving = true;
    nextFloor = targetFloor;// Go straight to target if there are no stops


    const isMovingUp = nextFloor > currentFloor;  // Determine direction
    const elevator = document.querySelector('.elevator');  // Elevator element to animate its movement
    const targetMarginBottom = (targetFloor - 1) * 100 + 25;
    
    let currentInterval; // Variable to hold the current interval for elevator movement
    currentInterval = setInterval(() => {

        let currentMarginBottom = parseInt(window.getComputedStyle(elevator).marginBottom, 10) || 0; // Get current position

        // Real-time check for intermediate stops in the queue while moving 
        // only for floors that are not already passed
        // and only when queue is updated or after elevator reaches a stop and there's a non-empty queue to check again

        if(newRequest || afterStop){
            nextFloor = getNextStop(isMovingUp, currentMarginBottom, targetMarginBottom);

        }
        
        console.log(`Next stop at floor ${nextFloor}!`)
        const nextFloorMarginBottom = (nextFloor - 1) * 100 + 25;  // Calculate the next floor (stop) position in pixels


        // If we've reached the target margin (either the main targetFloor or an intermediate nextFloor)
        if ((isMovingUp && currentMarginBottom >= nextFloorMarginBottom) || (!isMovingUp && currentMarginBottom <= nextFloorMarginBottom)) {

            currentFloor = nextFloor;  // Update the current floor
            console.log(`Reached floor ${currentFloor}!`);
            queue = queue.filter(floor => floor !== nextFloor);  // Remove the arrived floor from the queue
            resetButton(currentFloor); // Reset the button to default state

            isMoving = false;  // Mark as no longer moving

            if(currentFloor === targetFloor){
                console.log("Achieved target floor!");
                targetFloor = queue.length ? queue[0] : null;
                nextFloor = queue.length ? targetFloor : null;
                afterStop = true;
                clearInterval(currentInterval);  // Stop the interval when the target floor is reached
                openDoorsAtCurrentFloor().then(() => {
                    if(targetFloor){
                        moveElevator();
                    }
                });
            }else {
                console.log(`Moving on to target floor ${targetFloor}!`)
                afterStop = true;
                clearInterval(currentInterval);  // Stop the interval when the intermediate floor is reached
                openDoorsAtCurrentFloor().then(() => {
                    moveElevator();
                });
            }

        } else {
            // Move the elevator 1px at a time up or down depending on direction
            currentMarginBottom += isMovingUp ? 1 : -1;
            elevator.style.marginBottom = `${currentMarginBottom}px`;
            afterStop = false;
        }
    }, speed);  // Control the speed of the elevator movement
}


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
