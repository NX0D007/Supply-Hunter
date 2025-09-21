import { getCountryData } from '../data/countries/index.js';
import {
  populateCountries,
  populateLocationTypes,
  cleanDepartmentName,
  renderCheckboxes,
  updateTags,
  initSearch,
  state
} from '../modules/locationSelector/index.js';

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

// Fonctions pour gérer l'affichage des sections de localisation
function hideAllLocationSections() {
  document.getElementById('regionContainer').style.display = 'none';
  document.getElementById('departmentContainer').style.display = 'none';
  document.getElementById('communeContainer').style.display = 'none';
}

export function setupDomEvents({ buildQuery, companyKeywords }) {
  const countrySelect = document.getElementById('country');
  const locationTypeSelect = document.getElementById('locationType');
  const regionContainer = document.getElementById('regionContainer');
  const departmentContainer = document.getElementById('departmentContainer');
  const communeContainer = document.getElementById('communeContainer');
  const communeInput = document.getElementById('communeInput');
  const regionSearch = document.getElementById('regionSearch');
  const departmentSearch = document.getElementById('departmentSearch');
  const regionCheckboxes = document.getElementById('regionCheckboxes');
  const departmentCheckboxes = document.getElementById('departmentCheckboxes');
  const generateBtn = document.getElementById('generateBtn');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const searchUrlContainer = document.getElementById('searchUrlContainer');
  const searchUrlTextarea = document.getElementById('searchUrl');
  const platformSelect = document.getElementById('platform');
  const customPlatformInput = document.getElementById('customPlatform');
  const productInput = document.getElementById('product');
  const companyTypeSelect = document.getElementById('companyType');
  const precisionSelect = document.getElementById('precision');

  // tags container pour région
  const regionTagsContainer = document.createElement('div');
  regionTagsContainer.className = 'tags-container';
  regionSearch.parentNode.insertBefore(regionTagsContainer, regionSearch.nextSibling);

  // tags container pour département/province
  const departmentTagsContainer = document.createElement('div');
  departmentTagsContainer.className = 'tags-container';
  departmentSearch.parentNode.insertBefore(departmentTagsContainer, departmentSearch.nextSibling);

  // ✅ INITIALISER LES PLATEFORMES AU CHARGEMENT
  setTimeout(() => {
    populatePlatforms(platformSelect, customPlatformInput, state.currentCountry);
    handlePlatformChange(platformSelect, customPlatformInput);
  }, 0);

  // ✅ Gérer le changement de type de localisation
  locationTypeSelect.addEventListener('change', function() {
    state.currentLocationType = this.value;
    hideAllLocationSections();
    state.selectedLocations.clear();
    
    if (this.value === 'region') {
      regionContainer.style.display = 'block';
      updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch);
    } else if (this.value === 'department' || this.value === 'province') {
      departmentContainer.style.display = 'block';
      // ✅ CHANGE LE PLACEHOLDER SELON LE TYPE
      departmentSearch.placeholder = this.value === 'department' ? 
        'Rechercher un département...' : 'Rechercher une province...';
      updateTags(departmentTagsContainer, state.selectedLocations, renderCheckboxes, departmentSearch);
    } else if (this.value === 'commune') {
      communeContainer.style.display = 'block';
    }
  });

  // Gérer le changement de plateforme
  platformSelect.addEventListener('change', function() {
    handlePlatformChange(platformSelect, customPlatformInput);
  });

  // Init search logic pour région
  initSearch(regionSearch, regionCheckboxes, state.selectedLocations, () => updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch));

  // Init search logic pour département/province
  initSearch(departmentSearch, departmentCheckboxes, state.selectedLocations, () => updateTags(departmentTagsContainer, state.selectedLocations, renderCheckboxes, departmentSearch));

  // ✅ Country change - ADAPTER L'INTERFACE
  countrySelect.addEventListener('change', function () {
    state.currentCountry = this.value;
    state.selectedLocations.clear();
    
    // ✅ RESET ET METTRE À JOUR
    hideAllLocationSections();
    locationTypeSelect.value = '';
    
    populatePlatforms(platformSelect, customPlatformInput, state.currentCountry);
    handlePlatformChange(platformSelect, customPlatformInput);
    
    // ✅ METTRE À JOUR LES TYPES DE LOCALISATION
    populateLocationTypes(locationTypeSelect, 
      () => updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch),
      (s) => renderCheckboxes(regionCheckboxes, s, state.selectedLocations, 
        () => updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch), 
        regionSearch)
    );
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

  // ✅ INIT COUNTRIES
  populateCountries(countrySelect, locationTypeSelect);
  
  // ✅ INIT LOCATION TYPES APRÈS UN DELAI
  setTimeout(() => {
    populateLocationTypes(locationTypeSelect, 
      () => updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch),
      (s) => renderCheckboxes(regionCheckboxes, s, state.selectedLocations, 
        () => updateTags(regionTagsContainer, state.selectedLocations, renderCheckboxes, regionSearch), 
        regionSearch)
    );
  }, 100);
}