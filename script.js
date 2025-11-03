let map = L.map('map').setView([50, 10], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let mode = 'events'; // по умолчанию показываем события
let markers = [];
let places = [];

// загружаем данные
fetch('data.json')
    .then(r => r.json())
    .then(data => {
        places = data.places;
        createTimelineMarks();
        updateMap();
        updateList();
    });

// обновление карты
function updateMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const year = parseInt(document.getElementById('timeline').value);
    const range = 50; // ±50 лет

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

// обновление нижней панели
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

// обновление таймлайна при движении ползунка
document.getElementById('timeline').addEventListener('input', e => {
    document.getElementById('timeline-label').textContent = e.target.value;
    updateMap();
    updateList();
});

// переключение режимов
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
        const percent = ((year - min) / total) * 100;
        span.style.left = `${percent}%`;
        marksDiv.appendChild(span);
    }

    // века после н.э. до 1500
    for(let year = 0; year <= 1500; year += 100) {
        const span = document.createElement('span');
        span.textContent = `${year} н.э.`;
        const percent = ((year - min) / total) * 100;
        span.style.left = `${percent}%`;
        marksDiv.appendChild(span);
    }

    // десятилетия последних 500 лет
    for(let year = 1500; year <= max; year += 10) {
        const span = document.createElement('span');
        span.textContent = `${year} н.э.`;
        const percent = ((year - min) / total) * 100;
        span.style.left = `${percent}%`;
        marksDiv.appendChild(span);
    }
}

