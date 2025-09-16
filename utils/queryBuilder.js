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
  console.log('companyKeywords reçu:', companyKeywords);
  if (!product) throw new Error("Produit obligatoire");
  const finalPlatform = platform === 'custom' ? customPlatform : platform;
  if (platform === 'custom' && !finalPlatform) throw new Error("Plateforme obligatoire");

  let queryParts = [`site:${finalPlatform}`];
  const companyKeyword = companyKeywords[companyType] || '';
  // Mode strict et large supprimés, on ne traite que souple
  if (companyKeyword) queryParts.push(companyKeyword);
  queryParts.push(product);

  if (commune) queryParts.push(commune);
  else if (selectedLocations.size > 0) {
    Array.from(selectedLocations).forEach(location => {
      const cleanLocation = currentLocationType === 'department' ? cleanDepartmentName(location) : location;
      queryParts.push(cleanLocation);
    });
  } else queryParts.push(country);

  return queryParts.join(' ');
}
