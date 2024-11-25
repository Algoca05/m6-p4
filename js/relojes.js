// Digital Clock
function updateDigitalClock(timezone) {
    const now = luxon.DateTime.now().setZone(timezone).toFormat('HH:mm:ss');
    document.getElementById('digitalClock').textContent = now;
}

// Analog Clock
function updateAnalogClock(timezone) {
    const now = luxon.DateTime.now().setZone(timezone);
    const seconds = now.second;
    const minutes = now.minute;
    const hours = now.hour;

    const secondHand = document.getElementById('secondHand');
    const minuteHand = document.getElementById('minuteHand');
    const hourHand = document.getElementById('hourHand');

    secondHand.setAttribute('transform', `rotate(${seconds * 6}, 50, 50)`);
    minuteHand.setAttribute('transform', `rotate(${minutes * 6}, 50, 50)`);
    hourHand.setAttribute('transform', `rotate(${hours * 30 + minutes / 2}, 50, 50)`);
}

// Update both clocks
function updateClocks(timezone) {
    updateDigitalClock(timezone);
    updateAnalogClock(timezone);
}

// Initial call to display time immediately
updateClocks('local');
setInterval(() => updateClocks('local'), 1000);
