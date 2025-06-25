// config.js

export const apiKey = '996d55cd25ec536f5c327ca9df8d1d4a';
export let currentUnit = localStorage.getItem('weatherUnit') || 'metric'; // Default ke Celsius ('metric')

export function setCurrentUnit(unit) {
    currentUnit = unit;
    localStorage.setItem('weatherUnit', currentUnit);
}