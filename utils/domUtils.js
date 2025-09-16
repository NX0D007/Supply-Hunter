import {
  populateCountries,
  populateLocationTypes,
  cleanDepartmentName,
  renderCheckboxes,
  updateTags,
  initSearch
} from '../modules/LocationSelector/index.js';

export function setupDomEvents({ buildQuery, companyKeywords, state }) {
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

  // Init search logic
  initSearch(searchInput, checkboxContainer, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput));

  // Country change
  countrySelect.addEventListener('change', function () {
    state.currentCountry = this.value;
    state.selectedLocations.clear();
    populateLocationTypes(locationTypeSelect, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), (s) => renderCheckboxes(checkboxContainer, s, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput));
  });

  // Location type change
  locationTypeSelect.addEventListener('change', function () {
    state.currentLocationType = this.value;
    state.selectedLocations.clear();
    updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput);
    renderCheckboxes(checkboxContainer, '', state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput);
  });

  // Platform select change
  platformSelect.addEventListener('change', function () {
    if (this.value === 'custom') {
      customPlatformInput.style.display = 'block';
    } else {
      customPlatformInput.style.display = 'none';
      customPlatformInput.value = '';
    }
  });

  // Generate & open search
  generateBtn.addEventListener('click', function () {
    const product = productInput.value.trim();
    const companyType = companyTypeSelect.value;
    const platform = platformSelect.value;
    const customPlatform = customPlatformInput.value.trim();
  const precision = 'souple';
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
        companyKeywords: companyKeywords[country] || {},
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
    () => populateLocationTypes(locationTypeSelect, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), (s) => renderCheckboxes(checkboxContainer, s, state.selectedLocations, () => updateTags(tagsContainer, state.selectedLocations, renderCheckboxes, searchInput), searchInput))
  );
}
