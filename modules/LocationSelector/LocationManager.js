import { getCountryData, getCountryList } from '../../data/countries/index.js';

export const state = {
  selectedLocations: new Set(),
  currentCountry: null,
  currentLocationType: null,
};

export function getLocationListForCurrentType() {
  const data = getCountryData(state.currentCountry);
  if (!data) return [];
  const key = `${state.currentLocationType}s`;
  return data[key] || [];
}

export function populateCountries(countrySelect, locationTypeSelect, populateLocationTypes) {
  const initialValue = countrySelect.value || '';
  countrySelect.innerHTML = '';
  const countries = getCountryList();
  countries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    countrySelect.appendChild(opt);
  });
  if (countries.includes(initialValue)) countrySelect.value = initialValue;
  else countrySelect.value = countries[0] || '';
  state.currentCountry = countrySelect.value;
  populateLocationTypes();
}

export function populateLocationTypes(locationTypeSelect, updateTags, renderCheckboxes) {
  const data = getCountryData(state.currentCountry);
  if (!data) return;
  locationTypeSelect.innerHTML = '';
  data.locationTypes.forEach(lt => {
    const opt = document.createElement('option');
    opt.value = lt.value;
    opt.textContent = lt.label;
    locationTypeSelect.appendChild(opt);
  });
  state.currentLocationType = locationTypeSelect.value;
  state.selectedLocations.clear();
  updateTags();
  renderCheckboxes('');
}

export function cleanDepartmentName(department) {
  return department.replace(/\s*\(\d+[A-B]?\)$/, '');
}
