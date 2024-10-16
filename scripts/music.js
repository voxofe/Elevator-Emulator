// Access the audio element
const elevatorMusic = document.getElementById('elevator-music');

// Function to pause the music
function pauseMusic() {
    elevatorMusic.pause();
}

// Function to play the music
function playMusic() {
    elevatorMusic.play();
}

// Optional: Adding event listeners to buttons (if you want to manually control music)
document.getElementById('pause-music').addEventListener('click', pauseMusic);
document.getElementById('play-music').addEventListener('click', playMusic);
