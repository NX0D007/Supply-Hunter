import { renderCheckboxes } from './LocationDropdown.js';

export function initSearch(searchInput, checkboxContainer, selectedLocations, updateTags) {
  let isCheckboxContainerOpen = false;

  function showCheckboxContainer() {
    checkboxContainer.style.display = 'block';
    isCheckboxContainerOpen = true;
  }
  function hideCheckboxContainer() {
    checkboxContainer.style.display = 'none';
    isCheckboxContainerOpen = false;
  }

  searchInput.addEventListener('input', function () {
    renderCheckboxes(checkboxContainer, this.value, selectedLocations, updateTags, searchInput);
    showCheckboxContainer();
  });
  searchInput.addEventListener('focus', function () {
    renderCheckboxes(checkboxContainer, this.value, selectedLocations, updateTags, searchInput);
    showCheckboxContainer();
  });

  document.addEventListener('click', function (event) {
    if (isCheckboxContainerOpen &&
        !checkboxContainer.contains(event.target) &&
        !searchInput.contains(event.target)) {
      hideCheckboxContainer();
    }
  });
}
