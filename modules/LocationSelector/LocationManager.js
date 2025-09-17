import { getCountryData, getCountryList } from '../../data/countries/index.js';

export const state = {
  selectedLocations: new Set(),
  currentCountry: 'France',
  currentLocationType: null,
};

export function getLocationListForCurrentType() {
  const data = getCountryData(state.currentCountry);
  if (!data) return [];
  
  // ✅ ADAPTATION MULTI-PAYS
  if (state.currentLocationType === 'region') return data.regions || [];
  if (state.currentLocationType === 'department') return data.departments || [];
  if (state.currentLocationType === 'province') return data.provinces || [];
  if (state.currentLocationType === 'commune') return []; // Communes via input texte
  
  return [];
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
  
  // ✅ Paramètre optionnel
  if (populateLocationTypes && typeof populateLocationTypes === 'function') {
    populateLocationTypes();
  }
}

export function populateLocationTypes(locationTypeSelect, updateTags, renderCheckboxes) {
  const data = getCountryData(state.currentCountry);
  if (!data) return;
  
  locationTypeSelect.innerHTML = '';
  
  // ✅ OPTION VIDE
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Choisir l\'emplacement...';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  locationTypeSelect.appendChild(defaultOpt);
  
  // ✅ OPTIONS SPÉCIFIQUES AU PAYS
  data.locationTypes.forEach(lt => {
    const opt = document.createElement('option');
    opt.value = lt.value;
    opt.textContent = lt.label;
    locationTypeSelect.appendChild(opt);
  });
  
  state.currentLocationType = locationTypeSelect.value;
  state.selectedLocations.clear();
  if (updateTags) updateTags();
  if (renderCheckboxes) renderCheckboxes('');
}

export function cleanDepartmentName(department) {
  return department.replace(/\s*\(\d+[A-B]?\)$/, '');
}