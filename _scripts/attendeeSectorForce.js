module.exports = (groups, events, attendees, categories, topics, sectors) => {
    // Create a mapping of event ID to its primary sector
    const eventPrimarySectorMap = {};

    // Populate the mapping using the sectors data
    sectors.forEach(sector => {
        const { id, primary } = sector;
        eventPrimarySectorMap[id] = primary || "Undefined";
    });

    // Create an object to store the transformed attendee data
    const transformedAttendees = {};

    // Transform attendees data into the desired format
    attendees.forEach(attendee => {
        const transformedEvents = {};

        attendee.events.forEach(eventId => {
            const primarySector = eventPrimarySectorMap[eventId] || "Undefined";
            transformedEvents[eventId] = primarySector;
        });

        // Store the transformed events by attendee id
        transformedAttendees[attendee.id] = transformedEvents;
    });

    return transformedAttendees;
};