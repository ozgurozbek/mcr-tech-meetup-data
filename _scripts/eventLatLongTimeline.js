
module.exports = (groups, events, attendees) => {
    let year = {}, yearMonth = {}, locations = { all: [], year: [], yearMonth: [] };

    events.filter(e => e.id != "739637185").forEach(event => {
        if (event.venue) {
            if (event.venue.lat && event.venue.lon) {
                let eYear = event.local_date.substr(0,4), eYearMonth = event.local_date.substr(0,7);

                if (year[eYear]) {
                    year[eYear].push([event.venue.lat, event.venue.lon]);
                } else {
                    year[eYear] = [[event.venue.lat, event.venue.lon]];
                }

                if (yearMonth[eYearMonth]) {
                    yearMonth[eYearMonth].push([event.venue.lat, event.venue.lon]);
                } else {
                    yearMonth[eYearMonth] = [[event.venue.lat, event.venue.lon]];
                }

                locations.all.push([event.venue.lat, event.venue.lon]);
            }
        }
    });

    Object.keys(year).sort().forEach(yearStr => locations.year.push({ year: yearStr, events: year[yearStr] }));
    Object.keys(yearMonth).sort().forEach(yearMonthStr => locations.yearMonth.push({ yearMonth: yearMonthStr, events: yearMonth[yearMonthStr] }));

    return locations;
};