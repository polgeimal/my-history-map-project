let map = L.map('map').setView([50, 10], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let mode = 'events';
let markers = [];
let places = [];

// Загрузка данных
fetch('data.json')
    .then(r => r.json())
    .then(data => {
        places = data.places;
        createTimelineMarks();
        updateMap();
        updateList();
    });

function updateMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const year = parseInt(document.getElementById('timeline').value);
    const range = 50;

    places.forEach(place => {
        let items = mode === 'events' ? place.events : place.books;
        items.forEach(item => {
            let itemYear = parseInt(item.date);
            if(itemYear >= year - range && itemYear <= year + range) {
                let marker = L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b>${item.title}</b><br>${item.description}<br>(${item.date})`);
                markers.push(marker);
            }
        });
    });
}

function updateList() {
    const listDiv = document.getElementById('events-list');
    listDiv.innerHTML = '';

    const year = parseInt(document.getElementById('timeline').value);
    const range = 50;

    places.forEach(place => {
        let items = mode === 'events' ? place.events : place.books;
        items.forEach(item => {
            let itemYear = parseInt(item.date);
            if(itemYear >= year - range && itemYear <= year + range) {
                const div = document.createElement('div');
                div.textContent = `${item.title} (${item.date})`;
                div.onclick = () => map.setView([place.lat, place.lng], 5);
                listDiv.appendChild(div);
            }
        });
    });
}

// Таймлайн
document.getElementById('timeline').addEventListener('input', e => {
    document.getElementById('timeline-label').textContent = e.target.value;
    updateMap();
    updateList();
});

// Переключение событий / книг
document.getElementById('mode-events').addEventListener('click', () => {
    mode = 'events';
    document.getElementById('mode-events').classList.add('active');
    document.getElementById('mode-books').classList.remove('active');
    updateMap();
    updateList();
});
document.getElementById('mode-books').addEventListener('click', () => {
    mode = 'books';
    document.getElementById('mode-books').classList.add('active');
    document.getElementById('mode-events').classList.remove('active');
    updateMap();
    updateList();
});

// Метки таймлайна
function createTimelineMarks() {
    const marksDiv = document.getElementById('timeline-marks');
    marksDiv.innerHTML = '';

    const min = parseInt(document.getElementById('timeline').min);
    const max = parseInt(document.getElementById('timeline').max);
    const total = max - min;

    // античные века до н.э.
    for(let year = min; year < 0; year += 100) {
        const span = document.createElement('span');
        span.textContent = `${Math.abs(year)} до н.э.`;
        span.style.left = ((year - min) / total * 100) + '%';
        marksDiv.appendChild(span);
    }

    // века н.э. до 1500
    for(let year = 0; year <= 1500; year += 100) {
        const span = document.createElement('span');
        span.textContent = `${year} н.э.`;
        span.style.left = ((year - min) / total * 100) + '%';
        marksDiv.appendChild(span);
    }

    // десятилетия последних 500 лет
    for(let year = 1500; year <= max; year += 10) {
        const span = document.createElement('span');
        span.textContent = `${year} н.э.`;
        span.style.left = ((year - min) / total * 100) + '%';
        marksDiv.appendChild(span);
    }
}
