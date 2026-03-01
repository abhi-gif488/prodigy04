// Get DOM elements
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const timeDisplay = document.querySelector('.time-display');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');

const lapsContainer = document.getElementById('lapsContainer');

// Stopwatch variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCounter = 0;

// Format number to always show two digits
function formatTime(num) {
    return num < 10 ? '0' + num : num;
}

// Update the time display
function updateDisplay() {
    const totalMilliseconds = elapsedTime;
    
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
    
    hoursDisplay.textContent = formatTime(hours);
    minutesDisplay.textContent = formatTime(minutes);
    secondsDisplay.textContent = formatTime(seconds);
    millisecondsDisplay.textContent = formatTime(milliseconds);
}

// Start the stopwatch
function start() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        
        isRunning = true;
        timeDisplay.classList.add('running');
        
        // Update button states
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        lapBtn.disabled = false;
    }
}

// Pause the stopwatch
function pause() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        timeDisplay.classList.remove('running');
        
        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
    }
}

// Reset the stopwatch
function reset() {
    clearInterval(timerInterval);
    
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    lapCounter = 0;
    
    updateDisplay();
    timeDisplay.classList.remove('running');
    
    // Clear all laps
    lapsContainer.innerHTML = '<p class="no-laps">No laps recorded yet</p>';
    
    // Update button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    lapBtn.disabled = true;
}

// Record a lap time
function recordLap() {
    if (isRunning) {
        lapCounter++;
        
        // Remove "no laps" message if it exists
        const noLapsMsg = lapsContainer.querySelector('.no-laps');
        if (noLapsMsg) {
            noLapsMsg.remove();
        }
        
        // Create lap item
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        const lapNumber = document.createElement('span');
        lapNumber.className = 'lap-number';
        lapNumber.textContent = `Lap ${lapCounter}`;
        
        const lapTime = document.createElement('span');
        lapTime.className = 'lap-time';
        lapTime.textContent = `${hoursDisplay.textContent}:${minutesDisplay.textContent}:${secondsDisplay.textContent}.${millisecondsDisplay.textContent}`;
        
        lapItem.appendChild(lapNumber);
        lapItem.appendChild(lapTime);
        
        // Add to the beginning of the laps container
        lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
    }
}

// Event listeners
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 's':
            if (!startBtn.disabled) start();
            break;
        case 'p':
            if (!pauseBtn.disabled) pause();
            break;
        case 'r':
            reset();
            break;
        case 'l':
            if (!lapBtn.disabled) recordLap();
            break;
    }
});

// Initialize display
updateDisplay();
