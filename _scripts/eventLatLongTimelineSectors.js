
module.exports = (groups, events, attendees, categories, topics, sectors) => {
    let locations = [], sectorList = {
        "Industry & Manufacturing": {primary:[],secondary:[],tertiary:[]},
        "Urban Infrastructure": {primary:[],secondary:[],tertiary:[]},
        "Financial Technologies": {primary:[],secondary:[],tertiary:[]},
        "Cybersecurity": {primary:[],secondary:[],tertiary:[]},
        "Digital Commerce & Marketing": {primary:[],secondary:[],tertiary:[]},
        "Life Sciences": {primary:[],secondary:[],tertiary:[]},
        "Educational Technologies": {primary:[],secondary:[],tertiary:[]},
        "Social Impact & Sustainability": {primary:[],secondary:[],tertiary:[]},
        "Digital Governance": {primary:[],secondary:[],tertiary:[]},
        "Entertainment & Media Technologies": {primary:[],secondary:[],tertiary:[]},
        "Food Systems": {primary:[],secondary:[],tertiary:[]},
        "HR & Workplace Technologies": {primary:[],secondary:[],tertiary:[]},
        "Transportation Technologies": {primary:[],secondary:[],tertiary:[]},
        "Immersive Technologies": {primary:[],secondary:[],tertiary:[]},
        "Quality Assurance": {primary:[],secondary:[],tertiary:[]},
        "Service & Hospitality": {primary:[],secondary:[],tertiary:[]},
        "Undefined": [] //Leave it at the bottom
    };

    events.filter(e => e.id != "739637185").forEach(event => {
        if (event.venue) {
            if (event.venue.lat && (event.venue.lon || event.venue.lng)) {
                let coords = [event.venue.lat, lon = event.venue.lon || event.venue.lng];

                let sector = sectors.find(sector => sector.id == event.id);
                
                if (sector != null && sector !== undefined) {
                    
                    // Define the sectors and their corresponding list keys. Should be Sector > Tech Type > Event Type > Sector Type
                    const sectorTypes = ["primary", "secondary", "tertiary"];
                    const sectorEventTypes = ["base", "business", "social", "educational"];
                    const sectorTechTypes = ["deep-tech", "tech", "tech-enabled"];
                    const sectorNames = [
                        "Industry & Manufacturing", 
                        "Urban Infrastructure", 
                        "Financial Technologies", 
                        "Cybersecurity", 
                        "Digital Commerce & Marketing", 
                        "Life Sciences", 
                        "Educational Technologies", 
                        "Social Impact & Sustainability", 
                        "Digital Governance", 
                        "Entertainment & Media Technologies", 
                        "Food Systems", 
                        "HR & Workplace Technologies", 
                        "Transportation Technologies", 
                        "Immersive Technologies", 
                        "Quality Assurance", 
                        "Service & Hospitality",
                        "Undefined" //Leave it at the bottom
                    ];
                
                    // Iterate types (primary, secondary, tertiary) and append if type else create
                    sectorTypes.forEach((type) => {
                        if (sector[type] && sectorNames.includes(sector[type])) {
                            const sectorKey = sector[type];
                            if (sectorList[sectorKey] && sectorList[sectorKey][type]) {
                                sectorList[sectorKey][type].push(coords);
                            }
                        }
                    });
                } else {
                    // Sector is null or undefined, push to UNDEFINED_SECTOR
                    sectorList.Undefined.push(coords);
                }
                
                locations.push(coords);
            }
        }
    });

    return {locations, sectorList};
};