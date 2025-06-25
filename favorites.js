// favorites.js

import { fetchWeatherData } from './api.js'; // Untuk memicu pencarian ulang dari favorit
// currentUnit tidak secara langsung digunakan di favorites.js, bisa dihapus importnya jika tidak ada kebutuhan lain
// import { currentUnit } from './config.js'; 

export let favoriteCities = []; // Array untuk menyimpan nama kota favorit

const favoriteListEl = document.getElementById('favorite-list');

/**
 * Memuat lokasi favorit dari localStorage.
 */
export function loadFavorites() {
    const storedFavorites = localStorage.getItem('weatherFavorites');
    if (storedFavorites) {
        favoriteCities = JSON.parse(storedFavorites);
    }
    renderFavorites(); // Render daftar favorit setelah dimuat
}

/**
 * Menyimpan lokasi favorit ke localStorage.
 */
export function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favoriteCities));
}

/**
 * Menambahkan kota ke daftar favorit.
 * @param {string} city Nama kota yang akan ditambahkan.
 */
export function addFavorite(city) {
    if (city && city !== 'Nama Kota' && !favoriteCities.some(fav => fav.toLowerCase() === city.toLowerCase())) {
        favoriteCities.push(city);
        saveFavorites();
        renderFavorites(); // Perbarui tampilan favorit
        // Juga, nonaktifkan tombol tambah favorit jika kota sudah ditambahkan
        const addFavoriteBtn = document.getElementById('add-favorite-btn');
        if (addFavoriteBtn) {
            addFavoriteBtn.disabled = true;
            addFavoriteBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

/**
 * Menghapus kota dari daftar favorit.
 * @param {string} city Nama kota yang akan dihapus.
 */
export function removeFavorite(city) {
    favoriteCities = favoriteCities.filter(fav => fav.toLowerCase() !== city.toLowerCase());
    saveFavorites();
    renderFavorites(); // Perbarui tampilan favorit
    // Jika kota yang dihapus adalah kota yang sedang ditampilkan, aktifkan kembali tombol tambah favorit
    const currentCityNameEl = document.getElementById('city-name'); // Mengambil elemen untuk menghindari error jika null
    if (currentCityNameEl) {
        const currentCityName = currentCityNameEl.textContent.split(',')[0].trim();
        if (currentCityName.toLowerCase() === city.toLowerCase()) {
            const addFavoriteBtn = document.getElementById('add-favorite-btn');
            if (addFavoriteBtn) {
                addFavoriteBtn.disabled = false;
                addFavoriteBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }
}

/**
 * Merender (menampilkan) daftar lokasi favorit di UI.
 */
export function renderFavorites() {
    if (!favoriteListEl) return; // Pastikan elemen ada sebelum dimanipulasi

    favoriteListEl.innerHTML = ''; 

    if (favoriteCities.length === 0) {
        favoriteListEl.innerHTML = '<li class="text-zinc-400 text-center text-sm">Belum ada lokasi favorit.</li>';
        return;
    }

    favoriteCities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors duration-200';
        li.innerHTML = `
            <span class="font-medium text-lg text-white favorite-city-name">${city}</span>
            <button class="text-zinc-400 hover:text-red-400 transition-colors remove-favorite-btn" data-city="${city}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                </svg>
            </button>
        `;
        
        li.querySelector('.favorite-city-name').addEventListener('click', () => {
            document.getElementById('search-input').value = city; 
            fetchWeatherData('city', city); 
        });

        li.querySelector('.remove-favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation(); 
            removeFavorite(city);
        });

        favoriteListEl.appendChild(li);
    });
}