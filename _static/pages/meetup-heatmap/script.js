let heat;

window.addEventListener("load",() => {
    $.getJSON("../../data/eventLatLong.json", init);
});

function init(locations) {
  var map = L.map("map").setView([53.479159, -2.242726], 15);
  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
  heat = L.heatLayer(locations, {
    radius: 35,
    blur: 15,
  });
  heat.addTo(map);
}

function updateRadius(newRadius) {
  newRadius = parseInt(newRadius);
  heat.setOptions({ radius: newRadius });
}

function updateBlur(newBlur) {
  newBlur = parseInt(newBlur);
  heat.setOptions({ blur: newBlur });
}
