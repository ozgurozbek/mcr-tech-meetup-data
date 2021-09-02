window.addEventListener("load",() => {
    $.getJSON("../../data/eventLocations.json", renderMap);
});

function renderMap(events) {
    let tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    // let tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        }),
        latlng = L.latLng(53.48418045043945, -2.2363719940185547);
    
    let map = L.map('map', {
        center: latlng,
        zoom: 13,
        layers: [tiles]
    });
    
    let markers = L.markerClusterGroup({
        chunkedLoading: true
    });
    
    // let heat = L.heatLayer(events.map(e => [e.lat, e.lon]), {
    //     radius: 35,
    //     blur: 15,
    // }); markers.addLayer(heat);
    
    for (let i = 0; i < events.length; i++) {
        let a = events[i],
            title = `
                <p> ${timeConverter(a.time)}<br/>
                    Name: <a href="${a.eventLink}" target="_blank">${a.eventName}</a><br/>
                    Group: <a href="${a.groupLink}" target="_blank">${a.groupName}</a><br/>
                    Location: ${a.locationName}<br/>
                    RSVPs: ${a.attendees}</p>
                `;
        let marker = L.marker(L.latLng(a.lat, a.lon), {
            title: title
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
    }
    
    map.addLayer(markers);
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }