
module.exports = (groups, events, attendees) => {
    let locations = [];

    events.forEach(event => {
        if (event.venue) {
            if (event.venue.lat && event.venue.lon) {
                locations.push({
                    time: event.time,
                    lat: event.venue.lat,
                    lon: event.venue.lon,
                    locationName: event.venue.name,
                    eventName: event.name,
                    eventLink: event.link,
                    groupName: event.group.name,
                    groupLink: `https://www.meetup.com/${event.group.urlname}`,
                    attendees: event.yes_rsvp_count
                });
            }
        }
    });

    return locations;
};