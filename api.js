// api.js

import { apiKey, currentUnit } from './config.js';
import { displayWeatherData, displayForecastData, displayError, displayApiKeyError, hideAllMessages, showFavoriteButton, hideFavoriteButton } from './ui.js';

/**
 * Mengambil data prakiraan cuaca 5 hari / 3 jam dari OpenWeatherMap.
 * @param {string} city Nama kota untuk prakiraan.
 */
export async function getForecastByCity(city) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}&lang=id`;
    
    try {
        const response = await fetch(forecastApiUrl);
        if (!response.ok) {
            throw new Error('Gagal mengambil data prakiraan cuaca.');
        }
        const data = await response.json();
        displayForecastData(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        // forecastSection.classList.add('hidden') akan diurus oleh displayForecastData jika gagal
    }
}

/**
 * Fungsi umum untuk melakukan permintaan data cuaca ke OpenWeatherMap API (cuaca saat ini).
 * Menangani tampilan loading, error, dan pembaruan UI.
 * @param {string} type Tipe pencarian: 'city' atau 'coords'.
 * @param {string|object} identifier Nilai pencarian (nama kota atau objek {lat, lon}).
 * @returns {Promise<object|null>} Data cuaca jika berhasil, null jika gagal.
 */
export async function fetchWeatherData(type, identifier) {
    // console.log(`API: fetchWeatherData called for type: ${type}, identifier:`, identifier); // Debugging line
    if (apiKey === 'YOUR_API_KEY' || !apiKey || apiKey.length < 30) {
        displayApiKeyError();
        // console.log('API: API Key check failed.'); // Debugging line
        return null;
    }

    hideAllMessages(); // Sembunyikan semua pesan dan kartu cuaca
    // Loading message akan ditangani oleh UI

    let apiUrl;
    if (type === 'city') {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${identifier}&appid=${apiKey}&units=${currentUnit}&lang=id`;
    } else if (type === 'coords') {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${identifier.lat}&lon=${identifier.lon}&appid=${apiKey}&units=${currentUnit}&lang=id`;
    } else {
        console.error("Tipe pencarian tidak valid. Gunakan 'city' atau 'coords'.");
        displayError('Tipe pencarian tidak valid.');
        return null;
    }
    // console.log('API: Constructed API URL:', apiUrl); // Debugging line

    try {
        const response = await fetch(apiUrl);
        // console.log('API: Fetch response received:', response); // Debugging line
        if (!response.ok) {
            // console.log('API: Response NOT OK, status:', response.status); // Debugging line
            if (response.status === 401) {
                throw new Error('API key tidak valid. Periksa konfigurasi.');
            }
            throw new Error('Kota tidak ditemukan atau terjadi kesalahan.');
        }
        const data = await response.json();
        // console.log('API: Data received:', data); // Debugging line
        displayWeatherData(data);
        getForecastByCity(data.name); // Panggil fungsi prakiraan setelah mendapatkan cuaca utama
        showFavoriteButton(); // Tampilkan tombol favorit setelah sukses
        // console.log('API: Data displayed, forecast called, favorite button shown.'); // Debugging line
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message); // Debugging line
        if (error.message.includes('API key')) {
            displayApiKeyError();
        } else {
            displayError(error.message); // Tampilkan pesan error spesifik
        }
        hideFavoriteButton(); // Sembunyikan tombol favorit jika ada error
        return null;
    }
}