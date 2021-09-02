let pseudonyms = {
    "SpacePortX ": "SpacePortX",
    "Spaceport X": "SpacePortX",
    "Spaceportx, 24-26 Lever Street": "SpacePortX",
    "Spaceport": "SpacePortX",
    "Spaceport Manchester": "SpacePortX",
    "SpaceportX": "SpacePortX",
    "Space Port X": "SpacePortX",
    "Madlab": "MadLab",
    "Madlab Manchester": "MadLab",
    "MadLab Northern Quarter": "MadLab",
    "BBC Quay House": "BBC Media City",
    "Morecambe & Wise Room, Bridge House, BBC": "BBC Media City",
    "BBC Mediacity": "BBC Media City",
    "On the 7th Bar, Media City": "Social 7",
    "Auto Trader": "AutoTrader",
    "The Federation": "Federation House",
    "Code Computerlove, 4th Floor, Sevendale House, Dale Street,": "Code Computer Love",
    "Auto Trader UK": "AutoTrader",
    "Rental Cars": "BookingGo (Rentalcars)",
    "Barclays Eagle Lab Manchester": "Barclays Eagle Labs Manchester",
    "Autotrader Manchester": "AutoTrader",
    "Code Computerlove": "Code Computer Love",
    "WeWork Office Space No. 1 Spinningfields": "WeWork No. 1 Spinningfields",
    "2, Federation House": "Federation House",
    "Mad Lab": "MadLab",
    "Univesity of Salford Media City Campus": "MediaCityUK University of Salford",
    "Federation House ": "Federation House",
    "The Federation, Solidarity event space": "Federation House",
    "AUDITORIUM - CO-OP DIGITAL The Federation": "Federation House",
    "New Federation House (Dantzic Street entrance)": "Federation House",
    "Co-op Digital, 6th Floor, Federation House, ": "Federation House",
    "New Federation House": "Federation House",
    "Dept": "Dept Agency",
    "Eagle Labs Manchester  Manchester": "Barclays Eagle Labs Manchester",
    "WeWork Office Space One St Peter's Square": "WeWork One St Peter's Square",
    "RentalCars.com": "BookingGo (Rentalcars)",
    "BookingGo": "BookingGo (Rentalcars)",
    "The Landing": "The Landing MediaCityUK",
    "BookingGo (Booking.com)": "BookingGo (Rentalcars)",
    "The Landing, Media City": "The Landing MediaCityUK",
    "KPMG": "KPMG Manchester",
    "ao.com": "AO.com Riverside, Baskerville House",
    "AO Corporate Office": "AO.com Riverside, Baskerville House",
    "AO Manchester": "AO.com Riverside, Baskerville House",
    "The Shed": "The Shed/Innospace",
    "The Shed MMU": "The Shed/Innospace",
    "HOME": "HOME Manchester",
    "Ziferblat": "Ziferblat Edge Street",
    "Ziferblat ": "Ziferblat Edge Street"

};

function pseudonymMapper(name) {
    return pseudonyms[name] || name;
}

function getVenuesArray(events) {
    let venuesCount = [];

    // Create name/count pair of unique venues
    events.forEach(event => {
        let venueName = pseudonymMapper(event.venue.name), index = venuesCount.findIndex(v => v.name == venueName);
        if (index == -1) {
            venuesCount.push({
                name: venueName,
                count: event.yes_rsvp_count
            });
        } else {
            venuesCount[index].count += event.yes_rsvp_count
        }
    });

    // Process venues into a sorted flat array of strings
    return venuesCount.sort((a,b) => b.count - a.count).map(v => v.name);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

module.exports = (groups, events, attendees) => {
    let filteredEvents = events.filter(event => event.venue).filter(event => event.venue.name);
    let uniqueVenues = getVenuesArray(filteredEvents), dates = [];

    filteredEvents.forEach(event => {
        let date = event.local_date.substr(0, 7);
        let localDateIndex = dates.findIndex(d => d.time === date);
        let mappedVenueName = pseudonymMapper(event.venue.name);
        let venueIndex = uniqueVenues.findIndex(uv => uv == mappedVenueName);

        if (localDateIndex == -1) {
            let instances = new Array(uniqueVenues.length).fill(0);
            dates.push({ time: date, venues: instances });
        }

        let dateIndex = dates.findIndex(d => d.time == date);
        if (venueIndex != -1) dates[dateIndex].venues[venueIndex] += event.yes_rsvp_count;
    });

    dates = dates.sort((d1, d2) => new Date(d1.time) - new Date(d2.time));
    
    return [["Year/Month"].concat(uniqueVenues)].concat(dates.map(d => {
        return [d.time].concat(d.venues);
    }));
}