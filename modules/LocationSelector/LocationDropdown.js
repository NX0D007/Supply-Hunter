import { state, getLocationListForCurrentType } from './LocationManager.js';

export function renderCheckboxes(container, searchTerm, selectedLocations, updateTags, searchInput) {
  container.innerHTML = '';
  const list = getLocationListForCurrentType();
  list.forEach(location => {
    if (selectedLocations.has(location)) return;
    if (searchTerm && !location.toLowerCase().includes(searchTerm.toLowerCase())) return;
    createCheckboxElement(container, location, selectedLocations, updateTags, searchInput);
  });
  if (container.children.length === 0 && searchTerm !== '') {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'Aucun résultat trouvé';
    container.appendChild(noResults);
  }
}

function createCheckboxElement(container, location, selectedLocations, updateTags, searchInput) {
  const label = document.createElement('label');
  label.className = 'region-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = location;

  checkbox.addEventListener('change', function () {
    if (this.checked) {
      selectedLocations.add(location);
      updateTags();
      renderCheckboxes(container, searchInput.value, selectedLocations, updateTags, searchInput);
    }
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(location));
  container.appendChild(label);
}
