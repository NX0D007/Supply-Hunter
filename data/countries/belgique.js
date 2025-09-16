const Belgique = {
    name: "Belgique",
    regions: [
        "Région flamande",
        "Région wallonne",
        "Région de Bruxelles-Capitale"
    ],
    provinces: [
        "Anvers",
        "Brabant flamand",
        "Brabant wallon",
        "Flandre-Occidentale",
        "Flandre-Orientale",
        "Hainaut",
        "Liège",
        "Limbourg",
        "Luxembourg",
        "Namur"
    ],
    locationTypes: [
        { value: 'region', label: 'Région' },
        { value: 'province', label: 'Province' }
    ],
    platforms: [
        { value: 'kbopub.economie.fgov.be', label: 'KBO (Banque-Carrefour des Entreprises)' },
        { value: 'Pappers.be', label: 'Pappers' },
        { value: 'companyweb.be', label: 'Companyweb' },
        { value: 'infobel.be', label: 'Infobel' },        
        { value: 'custom', label: 'Autre (personnalisé)' }
    ]
};

export default Belgique;