import France from './france.js';
import Belgique from './belgique.js';

// This object is a map of all available countries
const countryData = {
  [France.name]: France,
  [Belgique.name]: Belgique
};

// A helper function to get data for a specific country
function getCountryData(countryName) {
  return countryData[countryName];
}

// A helper function to get the list of available country names
function getCountryList() {
  return Object.keys(countryData);
}

// Export what other files will need
export { countryData, getCountryData, getCountryList };