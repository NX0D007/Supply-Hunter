import { getCountryData } from '../data/countries/index.js';
import {
  populateCountries,
  populateLocationTypes,
  cleanDepartmentName,
  renderCheckboxes,
  updateTags,
  initSearch,
  state
} from '../modules/LocationSelector/index.js';

// Fonction pour peupler les plateformes en fonction du pays
function populatePlatforms(platformSelect, customPlatformInput, country) {
  const data = getCountryData(country);
  platformSelect.innerHTML = '';
  
  if (data && data.platforms) {
    data.platforms.forEach(platform => {
      const opt = document.createElement('option');
      opt.value = platform.value;
      opt.textContent = platform.label;
      platformSelect.appendChild(opt);
    });
  }
}

// Fonction pour gérer l'affichage du champ personnalisé
function handlePlatformChange(platformSelect, customPlatformInput) {
  if (platformSelect.value === 'custom') {
    customPlatformInput.style.display = 'block';
  } else {
    customPlatformInput.style.display = 'none';
    customPlatformInput.value = '';
  }
}

export function setupDomEvents({ buildQuery, companyKeywords }) {
  const countrySelect = document.getElementById('country');
  const locationTypeSelect = document.getElementById('locationType');
  const searchInput = document.getElementById('regionSearch');
  const checkboxContainer = document.getElementById('regionCheckboxes');
  const generateBtn = document.getElementById('generateBtn');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const searchUrlContainer = document.getElementById('searchUrlContainer');
  const searchUrlTextarea = document.getElementById('searchUrl');
  const platformSelect = document.getElementById('platform');
  const customPlatformInput = document.getElementById('customPlatform');
  const productInput = document.getElementById('product');
  const companyTypeSelect = document.getElementById('companyType');
  const precisionSelect = document.getElementById('precision');
  const communeInput = document.getElementById('commune');

  // tags container
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'tags-container';
  searchInput.parentNode.insertBefore(tagsContainer, searchInput.nextSibling);

  // ✅ FIX: INITIALIZE PLATFORMS IMMEDIATELY ON PAGE LOAD
  setTimeout(() => {
    populatePlatforms(platformSelect, customPlatformInput, state.currentCountry);
    handlePlatformChange(platformSelect, customPlatformInput);
  }, 0);

  // Gérer le changement de plateforme
  platformSelect.addEventListener('change', function() {
    handlePlatformChange(platformSelect, customPlatformInput);
  });

  // Init search logic
  initSearch(searchInput, checkboxContainer, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput));

  // Country change
  countrySelect.addEventListener('change', function () {
    state.currentCountry = this.value;
    state.selectedLocations.clear();
    
    // Mettre à jour les plateformes pour le nouveau pays
    populatePlatforms(platformSelect, customPlatformInput, state.currentCountry);
    handlePlatformChange(platformSelect, customPlatformInput);
    
    populateLocationTypes(locationTypeSelect, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), 
        (s) => renderCheckboxes(checkboxContainer, s, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput));
  });

  // Location type change
  locationTypeSelect.addEventListener('change', function () {
    state.currentLocationType = this.value;
    state.selectedLocations.clear();
    updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput);
    renderCheckboxes(checkboxContainer, '', state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput);
  });

  // Generate & open search
  generateBtn.addEventListener('click', function () {
    const product = productInput.value.trim();
    const companyType = companyTypeSelect.value;
    const platform = platformSelect.value;
    const customPlatform = customPlatformInput.value.trim();
    const precision = precisionSelect.value;
    const country = countrySelect.value;
    const commune = communeInput.value.trim();

    let finalQuery;
    try {
      finalQuery = buildQuery({
        product,
        companyType,
        platform,
        customPlatform,
        precision,
        country,
        commune,
        selectedLocations: state.selectedLocations,
        currentLocationType: state.currentLocationType,
        companyKeywords: companyKeywords[country.toLowerCase()] || {},
        cleanDepartmentName
      });
    } catch (e) {
      alert(e.message);
      return;
    }
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    searchUrlTextarea.value = searchUrl;
    searchUrlContainer.style.display = 'block';
    searchUrlContainer.scrollIntoView({ behavior: 'smooth' });
  });

  openSearchBtn.addEventListener('click', function () {
    const url = searchUrlTextarea.value;
    if (url && window.chrome && window.chrome.tabs) window.chrome.tabs.create({ url });
  });

  // init countries and location types
  populateCountries(countrySelect, locationTypeSelect,
    () => populateLocationTypes(locationTypeSelect, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), 
        (s) => renderCheckboxes(checkboxContainer, s, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput))
  );
}