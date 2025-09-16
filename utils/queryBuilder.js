export function buildQuery({
  product,
  companyType,
  platform,
  customPlatform,
  precision,
  country,
  commune,
  selectedLocations,
  currentLocationType,
  companyKeywords,
  cleanDepartmentName
}) {
  if (!product) throw new Error("Produit obligatoire");
  const finalPlatform = platform === 'custom' ? customPlatform : platform;
  if (platform === 'custom' && !finalPlatform) throw new Error("Plateforme obligatoire");

  let queryParts = [`site:${finalPlatform}`];
  
  // ✅ DICTIONNAIRE DE SECOURS
  const backupKeywords = {
    'Fabricant': 'fabricant',
    'Producteur': 'producteur',
    'Grossiste': 'grossiste', 
    'Distributeur': 'distributeur',
    'Importateur': 'importateur',
    'Détaillant': 'détaillant',
    'Négociant': 'négociant'
  };
  
  const userCompanyKeyword = companyKeywords[companyType] || backupKeywords[companyType] || '';
  
  // ✅ MODE LARGE
  if (precision === 'large') {
    const allKeywords = [userCompanyKeyword];
    
    // AJOUTE TOUS LES AUTRES TYPES SAUF Détaillant et SAUF celui choisi
    Object.entries(backupKeywords).forEach(([type, keyword]) => {
      if (type !== companyType && type !== 'Détaillant') {
        allKeywords.push(keyword);
      }
    });
    
    queryParts.push(`(${allKeywords.join(' OR ')})`);
    
  } else {
    // ✅ MODE SOUPLE
    if (userCompanyKeyword) {
      queryParts.push(userCompanyKeyword);
    }
  }
  
  // PRODUIT
  queryParts.push(product);

  // ✅ LOCALISATION - Gérer les 3 cas
  if (currentLocationType === 'commune') {
    // Utiliser la commune tapée
    if (commune) queryParts.push(commune);
  } else if (selectedLocations.size > 0) {
    // Utiliser régions/départements sélectionnés
    Array.from(selectedLocations).forEach(location => {
      const cleanLocation = currentLocationType === 'department' ? cleanDepartmentName(location) : location;
      queryParts.push(cleanLocation);
    });
  } else {
    // Fallback: utiliser le pays
    queryParts.push(country);
  }

  return queryParts.join(' ');
}