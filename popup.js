document.addEventListener('DOMContentLoaded', function() {
  // Configuration des régions françaises
  const regions = [
    "Île-de-France",
    "Provence-Alpes-Côte d'Azur",
    "Hauts-de-France",
    "Auvergne-Rhône-Alpes",
    "Nouvelle-Aquitaine",
    "Bretagne",
    "Normandie",
    "Grand-Est",
    "Centre-Val de Loire",
    "Bourgogne-Franche-Comté",
    "Occitanie",
    "Pays de la Loire",
    "Corse"
  ];
  
  // Configuration des départements français
  const departments = [
    "Ain (01)", "Aisne (02)", "Allier (03)", "Alpes-de-Haute-Provence (04)", "Hautes-Alpes (05)",
    "Alpes-Maritimes (06)", "Ardèche (07)", "Ardennes (08)", "Ariège (09)", "Aube (10)",
    "Aude (11)", "Aveyron (12)", "Bouches-du-Rhône (13)", "Calvados (14)", "Cantal (15)",
    "Charente (16)", "Charente-Maritime (17)", "Cher (18)", "Corrèze (19)", "Corse-du-Sud (2A)",
    "Haute-Corse (2B)", "Côte-d'Or (21)", "Côtes-d'Armor (22)", "Creuse (23)", "Dordogne (24)",
    "Doubs (25)", "Drôme (26)", "Eure (27)", "Eure-et-Loir (28)", "Finistère (29)",
    "Gard (30)", "Haute-Garonne (31)", "Gers (32)", "Gironde (33)", "Hérault (34)",
    "Ille-et-Vilaine (35)", "Indre (36)", "Indre-et-Loire (37)", "Isère (38)", "Jura (39)",
    "Landes (40)", "Loir-et-Cher (41)", "Loire (42)", "Haute-Loire (43)", "Loire-Atlantique (44)",
    "Loiret (45)", "Lot (46)", "Lot-et-Garonne (47)", "Lozère (48)", "Maine-et-Loire (49)",
    "Manche (50)", "Marne (51)", "Haute-Marne (52)", "Mayenne (53)", "Meurthe-et-Moselle (54)",
    "Meuse (55)", "Morbihan (56)", "Moselle (57)", "Nièvre (58)", "Nord (59)",
    "Oise (60)", "Orne (61)", "Pas-de-Calais (62)", "Puy-de-Dôme (63)", "Pyrénées-Atlantiques (64)",
    "Hautes-Pyrénées (65)", "Pyrénées-Orientales (66)", "Bas-Rhin (67)", "Haut-Rhin (68)", "Rhône (69)",
    "Haute-Saône (70)", "Saône-et-Loire (71)", "Sarthe (72)", "Savoie (73)", "Haute-Savoie (74)",
    "Paris (75)", "Seine-Maritime (76)", "Seine-et-Marne (77)", "Yvelines (78)", "Deux-Sèvres (79)",
    "Somme (80)", "Tarn (81)", "Tarn-et-Garonne (82)", "Var (83)", "Vaucluse (84)",
    "Vendée (85)", "Vienne (86)", "Haute-Vienne (87)", "Vosges (88)", "Yonne (89)",
    "Territoire de Belfort (90)", "Essonne (91)", "Hauts-de-Seine (92)", "Seine-Saint-Denis (93)",
    "Val-de-Marne (94)", "Val-d'Oise (95)"
  ];
  
  // Mots-clés pour chaque type d'entreprise
  const companyKeywords = {
    "Fabricant": "fabricant",
    "Producteur": "producteur",
    "Grossiste": "grossiste",
    "Distributeur": "distributeur",
    "Importateur": "importateur",
    "Détaillant": "détaillant",
    "Négociant": "négociant"
  };
  
  // Éléments DOM
  const searchInput = document.getElementById('regionSearch');
  const checkboxContainer = document.getElementById('regionCheckboxes');
  const platformSelect = document.getElementById('platform');
  const customPlatformInput = document.getElementById('customPlatform');
  const generateBtn = document.getElementById('generateBtn');
  const searchUrlContainer = document.getElementById('searchUrlContainer');
  const searchUrlTextarea = document.getElementById('searchUrl');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const locationTypeSelect = document.getElementById('locationType');
  
  // Créer un conteneur pour les tags
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'tags-container';
  searchInput.parentNode.insertBefore(tagsContainer, searchInput.nextSibling);
  
  // Données de sélection
  const selectedLocations = new Set();
  let isCheckboxContainerOpen = false;
  let currentLocationType = 'region'; // 'region' or 'department'
  
  // Initialisation
  initRegionSelector();
  initPlatformSelector();
  initGenerateButton();
  setupClickOutsideListener();
  initLocationTypeSelector();
  
  // Initialisation du sélecteur de type de localisation
  function initLocationTypeSelector() {
    locationTypeSelect.addEventListener('change', function() {
      currentLocationType = this.value;
      searchInput.placeholder = this.value === 'region' 
        ? "Choisissez la région..." 
        : "Choisissez le département...";
      selectedLocations.clear();
      updateTags();
      renderCheckboxes('');
    });
  }
  
  // Initialisation du sélecteur de région/département
  function initRegionSelector() {
    renderCheckboxes('');
    updateTags();
    
    searchInput.addEventListener('input', function() {
      renderCheckboxes(this.value);
      showCheckboxContainer();
    });
    
    searchInput.addEventListener('focus', function() {
      showCheckboxContainer();
    });
  }
  
  // Afficher le conteneur des checkbox
  function showCheckboxContainer() {
    checkboxContainer.style.display = 'block';
    isCheckboxContainerOpen = true;
  }
  
  // Cacher le conteneur des checkbox
  function hideCheckboxContainer() {
    checkboxContainer.style.display = 'none';
    isCheckboxContainerOpen = false;
  }
  
  // Configurer l'écouteur de clics en dehors
  function setupClickOutsideListener() {
    document.addEventListener('click', function(event) {
      if (isCheckboxContainerOpen && 
          !checkboxContainer.contains(event.target) && 
          !searchInput.contains(event.target)) {
        hideCheckboxContainer();
      }
    });
  }
  
  // Mise à jour des tags affichés
  function updateTags() {
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
      
      // Ajouter les écouteurs d'événements pour les boutons de fermeture
      document.querySelectorAll('.tag-close').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const location = this.getAttribute('data-location');
          selectedLocations.delete(location);
          updateTags();
          renderCheckboxes(searchInput.value);
        });
      });
    }
  }
  
  // Rendu des cases à cocher des régions/départements
  function renderCheckboxes(searchTerm) {
    checkboxContainer.innerHTML = '';
    
    const locationList = currentLocationType === 'region' ? regions : departments;
    
    // Afficher uniquement les localisations non sélectionnées qui correspondent au terme de recherche
    locationList.forEach(location => {
      if (!selectedLocations.has(location) && location.toLowerCase().includes(searchTerm.toLowerCase())) {
        createCheckboxElement(location);
      }
    });
    
    // Afficher un message si aucun résultat
    if (checkboxContainer.children.length === 0 && searchTerm !== '') {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'Aucun résultat trouvé';
      checkboxContainer.appendChild(noResults);
    }
  }
  
  // Création d'un élément checkbox
  function createCheckboxElement(location) {
    const label = document.createElement('label');
    label.className = 'region-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = location;
    
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        selectedLocations.add(location);
        updateTags();
        renderCheckboxes(searchInput.value);
      }
    });
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(location));
    checkboxContainer.appendChild(label);
  }
  
  // Initialisation du sélecteur de plateforme
  function initPlatformSelector() {
    platformSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        customPlatformInput.style.display = 'block';
      } else {
        customPlatformInput.style.display = 'none';
        customPlatformInput.value = '';
      }
    });
  }
  
  // Initialisation du bouton de génération
  function initGenerateButton() {
    generateBtn.addEventListener('click', generateSearch);
    openSearchBtn.addEventListener('click', openSearch);
  }
  
  // Fonction pour nettoyer le nom du département (enlever le code)
  function cleanDepartmentName(department) {
    return department.replace(/\s*\(\d+[A-B]?\)$/, '');
  }
  
  // Génération de l'URL de recherche
  function generateSearch() {
    // Récupération des valeurs des champs
    const product = document.getElementById('product').value.trim();
    const companyType = document.getElementById('companyType').value;
    const platform = document.getElementById('platform').value;
    const customPlatform = document.getElementById('customPlatform').value;
    const precision = document.getElementById('precision').value;
    const country = document.getElementById('country').value;
    const commune = document.getElementById('commune').value.trim();
    
    // Validation des champs requis
    if (!product) {
      alert('Veuillez saisir un produit ou une catégorie.');
      return;
    }
    
    // Détermination de la plateforme finale
    const finalPlatform = platform === 'custom' ? customPlatform : platform;
    if (platform === 'custom' && !finalPlatform) {
      alert('Veuillez saisir une plateforme.');
      return;
    }
    
    // Construction de la requête de recherche
    let queryParts = [];
    
    // Ajout du site
    queryParts.push(`site:${finalPlatform}`);
    
    // Récupération du mot-clé d'entreprise
    const companyKeyword = companyKeywords[companyType] || '';
    
    // Construction de la partie produit/entreprise selon la précision
    if (precision === 'strict') {
      // Strict: "fabricant poterie"
      queryParts.push(`"${companyKeyword} ${product}"`);
    } else if (precision === 'souple') {
      // Souple: fabricant poterie (sans guillemets)
      if (companyKeyword) {
        queryParts.push(companyKeyword);
      }
      queryParts.push(product);
    } else { 
      // Large: termes séparés sans opérateur spécifique
      if (companyKeyword) {
        queryParts.push(companyKeyword);
      }
      queryParts.push(product);
    }
    
    // Logique de localisation selon les règles confirmées
    const hasCommune = commune.trim() !== '';
    const hasRegionOrDepartment = selectedLocations.size > 0;
    
    if (hasCommune) {
      // RÈGLE 3: Si une commune est spécifiée, on utilise SEULEMENT la commune
      queryParts.push(commune);
    } else if (hasRegionOrDepartment) {
      // RÈGLE 2: Si une région/département est sélectionné, on utilise SEULEMENT le département/région
      Array.from(selectedLocations).forEach(location => {
        const cleanLocation = currentLocationType === 'department' 
          ? cleanDepartmentName(location) 
          : location;
        queryParts.push(cleanLocation);
      });
    } else {
      // RÈGLE 1: Si rien n'est spécifié, on utilise le pays
      queryParts.push(country);
    }
    
    // Construction de la requête finale
    const finalQuery = queryParts.join(' ');
    
    // Construction de l'URL finale
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
    
    // Affichage de l'URL générée
    searchUrlTextarea.value = searchUrl;
    searchUrlContainer.style.display = 'block';
    
    // Défilement vers le bas pour montrer le résultat
    searchUrlContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Ouverture de l'URL de recherche
  function openSearch() {
    const url = searchUrlTextarea.value;
    if (url) {
      chrome.tabs.create({ url: url });
    }
  }
});
