// script.js
let map = L.map('map').setView([55.75, 37.62], 5); // Москва центр

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Загружаем данные
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        window.places = data.places; // сохраняем глобально
        showEvents(2000); // первый год
    });

function showEvents(year) {
    // Удаляем старые маркеры
    if(window.markers) window.markers.forEach(m => map.removeLayer(m));
    window.markers = [];

    places.forEach(place => {
        place.events.forEach(event => {
            let eventYear = parseInt(event.date.split('-')[0]);
            if(eventYear === year) {
                let marker = L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b>${event.title}</b><br>${event.description}`);
                window.markers.push(marker);
            }
        });
    });
}

// Таймлайн
document.getElementById('timeline').addEventListener('input', e => {
    showEvents(parseInt(e.target.value));
});

