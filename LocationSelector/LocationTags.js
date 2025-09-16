export function updateTags(tagsContainer, selectedLocations, renderCheckboxes, searchInput) {
  tagsContainer.innerHTML = '';
  if (selectedLocations.size > 0) {
    Array.from(selectedLocations).forEach(location => {
      const tag = document.createElement('div');
      tag.className = 'region-tag';
      tag.innerHTML = `
        ${location}
        <span class="tag-close" data-location="${location}">×</span>
      `;
      tagsContainer.appendChild(tag);
    });

    document.querySelectorAll('.tag-close').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const location = this.getAttribute('data-location');
        selectedLocations.delete(location);
        updateTags(tagsContainer, selectedLocations, renderCheckboxes, searchInput);
        renderCheckboxes(document.getElementById('regionCheckboxes'), searchInput.value, selectedLocations, l => updateTags(tagsContainer, selectedLocations, renderCheckboxes, searchInput), searchInput);
      });
    });
  }
}
