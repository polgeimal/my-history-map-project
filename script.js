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
    .then(data => { places = data.places; updateMap(); updateList(); });

function updateMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    const year = parseInt(document.getElementById('timeline').value);

    places.forEach(place => {
        let items = mode === 'events' ? place.events : place.books;
        items.forEach(item => {
            let itemYear = parseInt(item.date);
            if(itemYear === year){
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

    places.forEach(place => {
        let items = mode === 'events' ? place.events : place.books;
        items.forEach(item => {
            let itemYear = parseInt(item.date);
            if(itemYear === year){
                const div = document.createElement('div');
                div.textContent = item.title;
                div.onclick = () => map.setView([place.lat, place.lng], 5);
                listDiv.appendChild(div);
            }
        });
    });
}

// таймлайн
document.getElementById('timeline').addEventListener('input', e => {
    document.getElementById('timeline-label').textContent = e.target.value;
    updateMap();
    updateList();
});

// переключение режима
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
