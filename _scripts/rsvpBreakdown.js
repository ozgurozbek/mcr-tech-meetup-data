
module.exports = (groups, events, attendees) => {
    let data = [], groupRSVPs = [], count = 0, example = [
        ['Shakespeare', null, 0],

        ['Comedies', 'Shakespeare', null],
        ['Tragedies', 'Shakespeare', null],
        ['Histories', 'Shakespeare', null],

        ['As You Like It', 'Comedies', null],
        ['Adam', 'As You Like It', 10]
    ];

    events.forEach(event => {
        let name = `${event.name} (${event.local_date}) - ${event.yes_rsvp_count} RSVPs`;
        if (!data.some(d => d[0] == name)) {
            data.push([name, event.group.name, event.yes_rsvp_count]);
            let groupIndex = groupRSVPs.findIndex(group => group.name == event.group.name);
            if (groupIndex == -1) {
                groupRSVPs.push({ name: event.group.name, rsvps: event.yes_rsvp_count });
            } else {
                groupRSVPs[groupIndex].rsvps += event.yes_rsvp_count;
            } count += event.yes_rsvp_count;
        }
    });

    let headerName = `Manchester Tech Communities - ${count} RSVPs`;

    groupRSVPs.forEach(group => {
        let groupName = `${group.name} - ${group.rsvps} RSVPs`;
        data.push([groupName, headerName, group.rsvps]);
        data.forEach((d, i) => {
            if (d[1] == group.name) data[i][1] = groupName;
        });
    })
    
    data.push([headerName, null, count]);

    return data.reverse();
};