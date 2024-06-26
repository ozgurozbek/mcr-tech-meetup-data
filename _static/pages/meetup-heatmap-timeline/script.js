let heat;
// let year = "2009";
let year = "2017";
let locations;
let radiusVal = 35;
let blurVal = 15;
let layerGroup;
let yearsArr;
let yearMonthsArr;
let delay = 100;

window.addEventListener("load",() => {
    $.getJSON("../../data/eventLatLongTimeline.json", init);
});

function init(data) {
  locations = data;
  yearsArr = locations.year.map(e => e.year);
  yearMonthsArr = locations.yearMonth.map(e => e.yearMonth);

  document.getElementById("year").max = yearsArr.length - 1;
  document.getElementById("yearMonth").max = yearMonthsArr.length - 1;

  var map = L.map("map").setView([53.479159, -2.242726], 15);

  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  layerGroup = L.layerGroup().addTo(map);
  heat = L.heatLayer(locations.all, { radiusVal, blurVal });
  document.getElementById("eventsCount").innerText = `Events: ${locations.all.length}`;
  heat.addTo(layerGroup);
}

function getYearData(year) {
  return locations.year.find(e => e.year == year).events;
}

function getYearMonthData(yearMonth) {
  return locations.yearMonth.find(e => e.yearMonth == yearMonth).events;
}

function updateRadius(newRadius) {
  newRadius = parseInt(newRadius);
  radiusVal = newRadius;
  heat.setOptions({ radius: newRadius });
}

function updateBlur(newBlur) {
  newBlur = parseInt(newBlur);
  blurVal = newBlur;
  heat.setOptions({ blur: newBlur });
}

function updateYear(val) {
  layerGroup.clearLayers();
  let yearValue = yearsArr[val], data = getYearData(yearValue);
  document.getElementById("year").value = val;
  heat = L.heatLayer(data, { radiusVal, blurVal });
  document.getElementById("eventsCount").innerText = `Events: ${data.length}`;
  document.getElementById("yearText").innerText = yearValue;
  heat.addTo(layerGroup);
}

// To refactor into `updateYear()`
function updateYearMonth(val) {
  layerGroup.clearLayers();
  let yearMonthValue = yearMonthsArr[val], data = getYearMonthData(yearMonthValue);
  document.getElementById("yearMonth").value = val;
  heat = L.heatLayer(data, { radiusVal, blurVal });
  document.getElementById("eventsCount").innerText = `Events: ${data.length}`;
  document.getElementById("yearMonthText").innerText = yearMonthValue; // To update
  heat.addTo(layerGroup);
}

async function yearProgress() {
  for (let x = 0; x < yearsArr.length; x++) {
    updateYear(x);
    await wait(delay);
  }
}

async function yearMonthProgress() {
  for (let x = 0; x < yearMonthsArr.length; x++) {
    updateYearMonth(x);
    await wait(delay);
  }
}

function updateMs(val) {
  delay = parseInt(val);
  document.getElementById("msText").innerText = `${val}ms`; // To update
}

const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));