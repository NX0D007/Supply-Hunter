import { state } from './modules/locationSelector/index.js';
import { buildQuery } from './utils/queryBuilder.js';
import { setupDomEvents } from './utils/domUtils.js';
import companyKeywords from './data/Keywords/companyKeywords.js';

document.addEventListener('DOMContentLoaded', function () {
  // Initialisation par défaut si nécessaire
  if (!state.currentCountry) state.currentCountry = 'France'; 
  if (!state.currentLocationType) state.currentLocationType = 'region';
  
  // ✅ CORRECTION : Utilisez .toLowerCase()
  setupDomEvents({ 
    buildQuery, 
    companyKeywords: companyKeywords[state.currentCountry.toLowerCase()] || {}, // ✅ Protection
    state 
  });
});