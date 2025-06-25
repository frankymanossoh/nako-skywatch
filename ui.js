// ui.js

import { currentUnit } from './config.js';
import { favoriteCities } from './favorites.js'; 


// === ELEMEN DOM ===
const weatherCard = document.getElementById('weather-card');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const apiKeyError = document.getElementById('api-key-error');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const weatherIconContainer = document.getElementById('weather-icon-container');
const temperatureEl = document.getElementById('temperature');
const weatherDescriptionEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

const addFavoriteBtn = document.getElementById('add-favorite-btn');
const forecastSection = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');
const unitToggleBtn = document.getElementById('unit-toggle'); 


/**
 * Mengembalikan markup SVG untuk ikon cuaca berdasarkan kode ikon OpenWeatherMap.
 * @param {string} iconCode Kode ikon dari OpenWeatherMap API (misal: "01d", "04n").
 * @returns {string} String SVG yang mewakili ikon cuaca.
 */
export function getWeatherIconSVG(iconCode) {
    const isDay = iconCode.endsWith('d');
    const mainCode = iconCode.substring(0, 2);
    
    const icons = {
        '01d': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><circle cx="32" cy="32" r="11.25" fill="#fcd34d" stroke="#fcd34d" stroke-miterlimit="10" stroke-width="2"></circle><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M32 15.75V9.25"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M32 48.25V54.75"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M43.49 20.51L48.08 15.92"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M15.92 48.08L20.51 43.49"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M20.51 20.51L15.92 15.92"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M48.08 48.08L43.49 43.49"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M15.75 32L9.25 32"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path><path fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M54.75 32L48.25 32"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="0 32 32;360 32 32"></animateTransform></path></g></svg>`,
        '01n': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path fill="#93c5fd" d="M43.67,34.15a13.51,13.51,0,0,1-2.25-10.74,13.41,13.41,0,0,1,5.5-8.83,13.5,13.5,0,1,0,0,25.07,13.41,13.41,0,0,1-3.25-5.5Z"><animateTransform attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="-15 32 32; 0 32 32; -15 32 32"/></path></g></svg>`,
        '02d': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.67,31.33a10.67,10.67,0,1,0-21.33.25" fill="#e2e8f0"></path><path d="M46.67,31.33a10.67,10.67,0,1,0-21.33.25" fill="none" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M30.08,18.75a11.25,11.25,0,1,1,11.25,11.25" fill="#fcd34d"></path><path d="M30.08,18.75a11.25,11.25,0,1,1,11.25,11.25" fill="none" stroke="#fcd34d" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></g></svg>`,
        '02n': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.67,31.33a10.67,10.67,0,1,0-21.33.25" fill="#e2e8f0"></path><path d="M46.67,31.33a10.67,10.67,0,1,0-21.33.25" fill="none" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M29.58,16.23a13.5,13.5,0,1,0,11.33,22.28" fill="#93c5fd"></path></g></svg>`,
        '03': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.5,31.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><animateTransform attributeName="transform" type="translate" values="-3 0; 3 0; -3 0" dur="2s" repeatCount="indefinite"/></g></svg>`,
        '04': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.5,31.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M32.5,36.5a8.5,8.5,0,1,0-17,0" fill="#e2e8f0" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><animateTransform attributeName="transform" type="translate" values="-3 0; 3 0; -3 0" dur="2s" repeatCount="indefinite"/></g></svg>`,
        '09': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.5,25.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M22,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path><path d="M30,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.2s" repeatCount="indefinite"/></path><path d="M38,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.4s" repeatCount="indefinite"/></path></g></svg>`,
        '10d': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M40.33,22.75a11.25,11.25,0,1,1,11.25,11.25" fill="#fcd34d"></path><path d="M34.5,28.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"></path><path d="M22,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path><path d="M30,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.2s" repeatCount="indefinite"/></path></g></svg>`,
        '10n': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M34.5,28.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"></path><path d="M29.58,16.23a13.5,13.5,0,1,0,11.33,22.28" fill="#93c5fd"></path><path d="M22,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite"/></path><path d="M30,40.5V49" fill="none" stroke="#60a5fa" stroke-linecap="round" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.2s" repeatCount="indefinite"/></path></g></svg>`,
        '11': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.5,25.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"></path><polygon points="32 38 27 46 33 46 29 54" fill="#fcd34d"><animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/></polygon></g></svg>`,
        '13': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M46.5,25.5a10.5,10.5,0,1,0-21,0" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"></path><path d="M25,42 l-3,3 l3,3" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" dur="1.5s" repeatCount="indefinite"/></path><path d="M32,42 l-3,3 l3,3" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" dur="1.5s" begin="0.2s" repeatCount="indefinite"/></path><path d="M39,42 l-3,3 l3,3" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animateTransform attributeName="transform" type="translate" values="0 0; 0 10; 0 0" dur="1.5s" begin="0.4s" repeatCount="indefinite"/></path></g></svg>`,
        '50': `<svg viewBox="0 0 64 64" class="w-full h-full"><g><path d="M17.5,44h29" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animate attributeName="stroke-width" values="2;4;2" dur="2s" repeatCount="indefinite"/></path><path d="M17.5,38h29" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animate attributeName="stroke-width" values="2;4;2" dur="2s" begin="0.5s" repeatCount="indefinite"/></path><path d="M17.5,32h29" fill="none" stroke="#cbd5e1" stroke-linecap="round" stroke-width="2"><animate attributeName="stroke-width" values="2;4;2" dur="2s" begin="1s" repeatCount="indefinite"/></path></g></svg>`
    };
    
    let iconKey = mainCode;
    if (['01', '02', '10'].includes(mainCode)) {
        iconKey += isDay ? 'd' : 'n';
    }

    return icons[iconKey] || icons['03']; 
}

/**
 * Menampilkan data cuaca di UI.
 * @param {object} data Objek data cuaca dari respons OpenWeatherMap.
 */
export function displayWeatherData(data) {
    if (!data || !data.main || !data.weather || !data.wind) {
        displayError('Data cuaca tidak lengkap atau tidak valid.');
        return;
    }

    let city = data.name; 
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed.toFixed(1); 

    // Opsional: Koreksi ejaan Cileungsir menjadi Cileungsi jika API mengembalikan "Cileungsir"
    // Perhatikan: Current context adalah Depok, jadi Cileungsir mungkin tidak relevan.
    if (city.toLowerCase() === 'cileungsir') {
        city = 'Cileungsi';
    }

    cityNameEl.textContent = `${city}, ${country}`;
    currentDateEl.textContent = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    temperatureEl.textContent = `${temp}°${currentUnit === 'metric' ? 'C' : 'F'}`;
    weatherDescriptionEl.textContent = description;
    
    weatherIconContainer.innerHTML = getWeatherIconSVG(iconCode);
    
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} m/s`;
    
    weatherCard.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    apiKeyError.classList.add('hidden');

    // Periksa apakah kota saat ini sudah ada di favorit untuk menonaktifkan/mengaktifkan tombol tambah favorit
    if (addFavoriteBtn) { // Tambahkan cek ini
        if (favoriteCities.some(fav => fav.toLowerCase() === city.toLowerCase())) {
            addFavoriteBtn.disabled = true;
            addFavoriteBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            addFavoriteBtn.disabled = false;
            addFavoriteBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

/**
 * Menampilkan data prakiraan cuaca di UI.
 * @param {object} data Objek data prakiraan dari respons OpenWeatherMap.
 */
export function displayForecastData(data) {
    if (!data || !data.list) {
        forecastSection.classList.add('hidden');
        return;
    }

    forecastContainer.innerHTML = ''; 

    const dailyForecasts = {};
    const today = new Date().toISOString().split('T')[0]; 
    let daysCount = 0; 

    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0]; 
        const hour = date.getHours();

        if (dateKey === today) {
            continue; 
        }

        if (!dailyForecasts[dateKey] && hour >= 10 && hour <= 16) {
             dailyForecasts[dateKey] = item;
             daysCount++;
             if (daysCount >= 5) break; 
        }
    }
    
    const forecastItems = Object.values(dailyForecasts);

    if (forecastItems.length === 0) {
        forecastSection.classList.add('hidden');
        return;
    }

    forecastItems.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'flex flex-col items-center p-3 bg-white/5 rounded-lg';
        forecastCard.innerHTML = `
            <p class="text-sm text-zinc-300">${dayName}</p>
            <div class="w-12 h-12 my-2">${getWeatherIconSVG(iconCode)}</div>
            <p class="font-semibold text-lg">${temp}°${currentUnit === 'metric' ? 'C' : 'F'}</p>
            <p class="text-xs text-zinc-400 capitalize">${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastCard);
    });

    forecastSection.classList.remove('hidden'); 
}

/**
 * Menyembunyikan semua pesan dan kartu cuaca, menampilkan loading.
 * CATATAN PENTING: Fungsi ini biasanya dipanggil di awal fetch data
 * untuk MENYEMBUNYIKAN semua elemen UI yang tidak relevan sementara loading.
 * Jika pesan loading ingin tetap terlihat, logika ini perlu diubah.
 * Namun, karena user melaporkan pesan loading terus terlihat,
 * saya mengasumsikan tujuan hideAllMessages adalah menyembunyikan SEMUA.
 */
export function hideAllMessages() {
    // BUG FIX: Seharusnya menambahkan 'hidden' untuk menyembunyikan, bukan menghapus.
    loadingMessage.classList.add('hidden'); // <--- BARIS INI YANG DIBENARKAN
    if (weatherCard) weatherCard.classList.add('hidden'); // Tambah cek keamanan
    if (errorMessage) errorMessage.classList.add('hidden'); // Tambah cek keamanan
    if (apiKeyError) apiKeyError.classList.add('hidden'); // Tambah cek keamanan
    if (forecastSection) forecastSection.classList.add('hidden'); // Tambah cek keamanan
    if (addFavoriteBtn) { 
        addFavoriteBtn.classList.add('hidden'); 
    }
}

/**
 * Menampilkan pesan "Kota tidak ditemukan" atau error umum lainnya.
 * @param {string} [message='Kota tidak ditemukan atau terjadi kesalahan.'] Pesan error kustom.
 */
export function displayError(message = 'Kota tidak ditemukan atau terjadi kesalahan.') {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    apiKeyError.classList.add('hidden');
    forecastSection.classList.add('hidden');
    if (addFavoriteBtn) { // Tambahkan cek ini
        addFavoriteBtn.classList.add('hidden');
    }
    loadingMessage.classList.add('hidden'); 
}

/**
 * Menampilkan pesan error spesifik terkait API Key.
 */
export function displayApiKeyError() {
    apiKeyError.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingMessage.classList.add('hidden');
    forecastSection.classList.add('hidden');
    if (addFavoriteBtn) { // Tambahkan cek ini
        addFavoriteBtn.classList.add('hidden');
    }
}

/**
 * Menampilkan tombol tambah favorit.
 */
export function showFavoriteButton() {
    if (addFavoriteBtn) { // Tambahkan cek ini
        addFavoriteBtn.classList.remove('hidden');
    }
}

/**
 * Menyembunyikan tombol tambah favorit.
 */
export function hideFavoriteButton() {
    if (addFavoriteBtn) { // Tambahkan cek ini
        addFavoriteBtn.classList.add('hidden');
    }
}

/**
 * Menginisialisasi tampilan tombol unit suhu.
 */
export function initializeUnitToggle(unit) {
    if (unitToggleBtn) { 
        unitToggleBtn.textContent = unit === 'metric' ? '°C / °F' : '°F / °C';
    }
}