import { state } from './modules/LocationSelector/index.js';
import { buildQuery } from './utils/queryBuilder.js';
import { setupDomEvents } from './utils/domUtils.js';
import companyKeywords from './data/keywords/companyKeywords.js';

document.addEventListener('DOMContentLoaded', function () {
  // Initialisation par défaut si nécessaire
  if (!state.currentCountry) state.currentCountry = 'france';
  if (!state.currentLocationType) state.currentLocationType = 'region';
  setupDomEvents({ buildQuery, companyKeywords: companyKeywords[state.currentCountry], state }); // Passe l'objet complet
});
