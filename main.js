// main.js

import { apiKey, currentUnit, setCurrentUnit } from './config.js';
import { fetchWeatherData } from './api.js';
import { loadFavorites, addFavorite } from './favorites.js';
import { initializeUnitToggle, displayError, displayApiKeyError } from './ui.js';

// === ELEMEN DOM (yang hanya dibutuhkan di main.js) ===
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const unitToggleBtn = document.getElementById('unit-toggle');
const addFavoriteBtn = document.getElementById('add-favorite-btn');
const cityNameEl = document.getElementById('city-name'); 


// --- Event Listeners ---

searchForm.addEventListener('submit', async (e) => { 
    e.preventDefault(); 
    console.log('1. Form Submitted!'); 
    const city = searchInput.value.trim(); 
    if (city) { 
        console.log('2. City input:', city); 
        await fetchWeatherData('city', city); 
        searchInput.value = ''; 
    } else {
        displayError('Mohon masukkan nama kota untuk mencari.');
        console.log('2. Empty city input.'); 
    }
});

// Event Listener untuk tombol Unit Toggle
unitToggleBtn.addEventListener('click', () => {
    const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric'; 
    setCurrentUnit(newUnit); 
    initializeUnitToggle(newUnit); 

    const currentCity = cityNameEl.textContent.split(',')[0].trim();
    if (currentCity && currentCity !== 'Nama Kota' && currentCity !== '') { 
        fetchWeatherData('city', currentCity); 
    } else {
        // Jika tidak ada kota yang ditampilkan, panggil onPageLoad untuk memuat ulang lokasi default
        onPageLoad(); 
    }
});

// Event Listener untuk tombol "Tambah Favorit"
addFavoriteBtn.addEventListener('click', () => {
    const currentCity = cityNameEl.textContent.split(',')[0].trim(); 
    if (currentCity && currentCity !== 'Nama Kota' && currentCity !== '') {
        addFavorite(currentCity);
    }
});


/**
 * Fungsi yang dijalankan saat halaman HTML selesai dimuat.
 * Menginisialisasi aplikasi dengan mencoba mendapatkan lokasi pengguna atau memuat lokasi default,
 * serta memuat pengaturan dan data awal.
 */
function onPageLoad() {
    console.log('0. onPageLoad triggered!'); 
    if (apiKey === 'YOUR_API_KEY' || !apiKey || apiKey.length < 30) {
        displayApiKeyError();
        console.log('0. API Key error detected!'); 
        return;
    }

    initializeUnitToggle(currentUnit); 
    loadFavorites(); 

    if (navigator.geolocation) {
        console.log('0. Geolocation supported.'); 
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('0. Geolocation success.'); 
                const { latitude, longitude } = position.coords;
                fetchWeatherData('coords', { lat: latitude, lon: longitude });
            },
            (error) => {
                console.warn('Pengguna menolak akses lokasi atau terjadi kesalahan Geolocation:', error.message);
                console.log('0. Geolocation failed, defaulting to Depok.'); 
                fetchWeatherData('city', 'Depok'); 
            }
        );
    } else {
        console.warn('Geolocation tidak didukung oleh browser ini. Memuat lokasi default.');
        console.log('0. Geolocation not supported, defaulting to Depok.'); 
        fetchWeatherData('city', 'Depok'); 
    }
}

// Panggil fungsi onPageLoad saat seluruh DOM selesai dimuat
document.addEventListener('DOMContentLoaded', onPageLoad);