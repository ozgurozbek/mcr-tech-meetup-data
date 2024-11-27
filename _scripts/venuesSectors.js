module.exports = (groups, events, attendees, categories, topics, sectors) => {
    let sectorData = {};

    // Check if events and sectors have valid data
    if (!events || !sectors || events.length === 0 || sectors.length === 0) {
        // console.error("Events or sectors data is missing or empty");
        return sectorData;
    }

    // Creating List of all Venues grouped by Sector
    events.forEach(event => {
        if (!event.id) {
            // console.error("Event missing an ID:");
            return;
        }

        // Find the sector where the event.id matches sector.id
        let matchingSector = sectors.find(sector => sector.id === event.id);

        if (matchingSector && matchingSector.primary) {
            let sectorName = matchingSector.primary;

            // Initialize the sector entry if not present
            if (!sectorData[sectorName]) {
                sectorData[sectorName] = {};
            }

            // Add the venue name to the sector data
            if (event.venue && event.venue.name) {
                let venueName = event.venue.name;
                if (!sectorData[sectorName][venueName]) {
                    sectorData[sectorName][venueName] = 0;
                }
                sectorData[sectorName][venueName]++;
            } else {
                // console.error("Event missing venue information:");
            }
        } else {
            // console.error("No matching sector found for event:");
        }
    });

    // Returning the structured sector data
    return sectorData;
};
