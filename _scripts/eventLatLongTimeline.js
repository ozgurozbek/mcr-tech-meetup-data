
module.exports = (groups, events, attendees) => {
    let year = {}, yearMonth = {}, locations = { all: [], year: [], yearMonth: [] };

    events.filter(e => e.id != "739637185").forEach(event => {
        if (event.venue) {
            if (event.venue.lat && (event.venue.lon || event.venue.lng)) {
                let eYear = event.local_date.substr(0,4), eYearMonth = event.local_date.substr(0,7), coords = [event.venue.lat, lon = event.venue.lon || event.venue.lng];

                if (year[eYear]) {
                    year[eYear].push(coords);
                } else {
                    year[eYear] = [coords];
                }

                if (yearMonth[eYearMonth]) {
                    yearMonth[eYearMonth].push(coords);
                } else {
                    yearMonth[eYearMonth] = [coords];
                }

                locations.all.push(coords);
            }
        }
    });

    Object.keys(year).sort().forEach(yearStr => locations.year.push({ year: yearStr, events: year[yearStr] }));
    Object.keys(yearMonth).sort().forEach(yearMonthStr => locations.yearMonth.push({ yearMonth: yearMonthStr, events: yearMonth[yearMonthStr] }));

    return locations;
};