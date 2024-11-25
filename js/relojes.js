// Digital Clock
let dateFormat = '24H'; // Default date format

function updateDigitalClock(timezone) {
    let now = luxon.DateTime.now().setZone(timezone);
    let timeString, dateString;

    if (dateFormat === '24H') {
        timeString = now.toFormat('HH:mm:ss');
        dateString = now.toFormat('yyyy-MM-dd');
    } else if (dateFormat === '12H') {
        timeString = now.toFormat('hh:mm:ss a');
        dateString = now.toFormat('yyyy-MM-dd');
    } else if (dateFormat === 'ISO') {
        timeString = now.toISO();
        dateString = '';
    } else if (dateFormat === 'DD/MM/YYYY') {
        timeString = now.toFormat('HH:mm:ss');
        dateString = now.toFormat('dd/MM/yyyy');
    } else if (dateFormat === 'DIA-MES-AÑO') {
        timeString = now.toFormat('HH:mm:ss');
        dateString = now.toFormat('dd-MM-yyyy');
    } else if (dateFormat === 'DIA-MES-AÑO (SIMPLIFICADO)') {
        timeString = now.toFormat('HH:mm:ss');
        dateString = now.toFormat('dd-MM-yy');
    }

    document.getElementById('digitalClock').textContent = timeString;
    document.getElementById('digitalDate').textContent = dateString;
    document.getElementById('selectedCountry').textContent = localStorage.getItem('clickedCountry') || 'No country selected';
}

let latitude, longitude, currentTimezone;

function setCoordinates(lat, lon) {
    latitude = lat;
    longitude = lon;
    currentTimezone = tzlookup(latitude, longitude);
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    updateClocks(currentTimezone);
}

function setDateFormat(format) {
    dateFormat = format;
    localStorage.setItem('dateFormat', dateFormat);
    updateClocks(currentTimezone);
}

function loadSettings() {
    const savedDateFormat = localStorage.getItem('dateFormat');
    const savedLatitude = localStorage.getItem('latitude');
    const savedLongitude = localStorage.getItem('longitude');
    const savedCountry = localStorage.getItem('clickedCountry');
    const savedCentered = localStorage.getItem('centered');
    const savedColor = localStorage.getItem('color');

    if (savedDateFormat) {
        dateFormat = savedDateFormat;
    }

    if (savedLatitude && savedLongitude) {
        setCoordinates(parseFloat(savedLatitude), parseFloat(savedLongitude));
    } else {
        currentTimezone = 'local';
        updateClocks(currentTimezone);
    }

    if (savedCountry) {
        document.getElementById('selectedCountry').textContent = savedCountry;
    }

    if (savedCentered) {
        document.getElementById('selectedCountry').style.textAlign = savedCentered;
    }

    if (savedColor) {
        document.getElementById('selectedCountry').style.color = savedColor;
    }
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

// Load settings and initial call to display time immediately
loadSettings();
setInterval(() => updateClocks(currentTimezone), 1000);
