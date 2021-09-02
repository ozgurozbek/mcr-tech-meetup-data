
module.exports = (groups, events, attendees) => {
    let locations = [];

    events.forEach(event => {
        if (event.venue) if (event.venue.lat && event.venue.lon) locations.push([event.venue.lat, event.venue.lon]);
    });

    return locations;
};