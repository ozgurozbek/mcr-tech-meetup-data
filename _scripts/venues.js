module.exports = (groups, events, attendees) => {
    // Creating List of all Venues
    let venuesList = [];
    events.forEach(event => {
        if (event.venue) venuesList.push(event.venue.name);
    });
    // Counting venues
    let venueCount = [];
    venuesList.forEach(venueName => {
        let index = venueCount.findIndex(countObj => countObj.name == venueName);
        if (index == -1) venueCount.push({ name: venueName, count: 1 });
        if (index != -1) venueCount[index].count++;
    });
    // Ordering
    venueCount = venueCount.sort((a,b) => b.count - a.count);
    // Returning
    return venueCount;
};