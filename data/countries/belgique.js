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
        { value: 'region', label: 'Region' },
        { value: 'province', label: 'Province' },
        { value: 'commune', label: 'Commune' }
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