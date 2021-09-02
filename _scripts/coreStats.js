
module.exports = (groups, events, attendees) => {
    return {
        general: {
            groupCount: groups.length,
            eventsCount: events.length,
            attendeesCount: attendees.length,
            rsvpCount: events.reduce((total, event) => total + event.yes_rsvp_count, 0)
        },
        years: getYearsArray(events).map(year => {
            return {
                year: parseInt(year),
                data: getYearData(events, attendees, year)
            }
        })
    }
};

function getYearData(events, attendees, year) {
    let filteredEvents = events.filter(e => e.local_date.includes(year)), attendeeIds = [], groups = [], venues = [];
    // Get Attendees Count
    filteredEvents.forEach(e => attendees.forEach(a => {
        if (a.events.includes(e.id)) attendeeIds.push(a.id);
    })); attendeeIds.filter(onlyUnique);
    // Get RSVPs
    let rsvps = filteredEvents.reduce((total, event) => total + event.yes_rsvp_count, 0);
    // Get Active Groups
    filteredEvents.forEach(e => groups.push(e.group.name));
    groups = groups.filter(onlyUnique);
    // Get Venues
    filteredEvents.forEach(e => { if (e.venue) if (e.venue.name) venues.push(e.venue.name); });
    venues = venues.filter(onlyUnique);
    // Return
    return {
        activeGroups: groups.length,
        averageGroupEvents: roundToTwo(filteredEvents.length / groups.length),
        events: filteredEvents.length,
        rsvps: rsvps,
        venues: venues.length,
        attendees: attendeeIds.length,
        averageAttendeeRsvp: roundToTwo(rsvps / attendeeIds.length)
    }
}

function getYearsArray(events) {
    let years = events.filter(e => e.local_date != undefined).map(e => e.local_date.substr(0, 4)).filter(onlyUnique).sort();
    return years.slice(1, years.length - 2);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}