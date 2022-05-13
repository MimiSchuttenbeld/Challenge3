mapboxgl.accessToken = 'pk.eyJ1IjoibWltaXNjaHV0IiwiYSI6ImNsMzRrOWJkbjA1N2QzanA1eGVlMzlvaG0ifQ.OtrdD86mRJrSXjBZWQ6f1Q';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-79.4512, 43.6568],
zoom: 8
});
 

const coordinatesGeocoder = function (query) {
// Match anything which looks like
// decimal degrees coordinate pair.
const matches = query.match(
/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
);
if (!matches) {
return null;
}
 
function coordinateFeature(lng, lat) {
return {
center: [lng, lat],
geometry: {
type: 'Point',
coordinates: [lng, lat]
},
place_name: 'Lat: ' + lat + ' Lng: ' + lng,
place_type: ['coordinate'],
properties: {},
type: 'Feature'
};
}
 
const coord1 = Number(matches[1]);
const coord2 = Number(matches[2]);
const geocodes = [];
 
if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
geocodes.push(coordinateFeature(coord1, coord2));
}
 
if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
geocodes.push(coordinateFeature(coord2, coord1));
}
 
if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
geocodes.push(coordinateFeature(coord1, coord2));
geocodes.push(coordinateFeature(coord2, coord1));
}
 
return geocodes;
};

// Add the control to the map.
map.addControl(
    new MapboxGeocoder ({
    accessToken: mapboxgl.accessToken,
    localGeocoder: coordinatesGeocoder,
    zoom: 4,
    placeholder: 'Try: -40, 170',
    reverseGeocode: true
    })
);

// tweede map met weergave van terrein/ondergrond
mapboxgl.accessToken = 'pk.eyJ1IjoibWltaXNjaHV0IiwiYSI6ImNsMzRrOWJkbjA1N2QzanA1eGVlMzlvaG0ifQ.OtrdD86mRJrSXjBZWQ6f1Q';

const map2 = new mapboxgl.Map({
container: 'dataset1',
zoom: 13.1,
center: [-114.34411, 32.6141],
pitch: 85,
bearing: 80,
style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
});
 
map.on('load', () => {
map.addSource('mapbox-dem', {
'type': 'raster-dem',
'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
'tileSize': 512,
'maxzoom': 14
});
// add the DEM source as a terrain layer with exaggerated height
map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
 
// add a sky layer that will show when the map is highly pitched
map.addLayer({
'id': 'sky',
'type': 'sky',
'paint': {
'sky-type': 'atmosphere',
'sky-atmosphere-sun': [0.0, 0.0],
'sky-atmosphere-sun-intensity': 15
}
});
});


// Al het ochtend is Goedemorgen zeggen etc. 
// Tijd ophalen
function startTime() {
    const today = new Date();
    let uur = today.getHours();
    let minuut = today.getMinutes();
    let seconde = today.getSeconds();
    minuut = checkTime(minuut);
    seconde = checkTime(seconde);
    // geef tijd
    document.getElementById('klok').innerHTML = uur + ":" + minuut + ":" + seconde;
    // seconden laten tellen elke seconde
    setTimeout(startTime, 1000);
  }
  // 0 toevoegen voor tijd als getallen lager zijn dan 10 (08 uur)
function checkTime(i) {
    if (i < 10) {i = "0" + i};  
    return i;
}

// Bericht veranderen per tijdvak

// var currentTime = 12.00 
var currentTime = new Date().getHours();
// nieuwe variabele linken aan vorige functions voor efficientie
if (document.body) {   
    if (0 <= currentTime && currentTime < 12) {
        document.getElementById('groet').innerHTML = "Goedenmorgen! Tijd: ";
    }
    if (12 <= currentTime && currentTime < 18) {
        document.getElementById('groet').innerHTML = "Goedemiddag! Tijd:";
    }
    if (18 <= currentTime && currentTime < 23.59) {
        document.getElementById('groet').innerHTML = "Goedenavond! Tijd: ";
    }     
}     


// op basis van schermgrootte bericht veranderen hieronder/hiernaast 
if (window.innerWidth < 768) {

    // If less than 768
    document.getElementById('infotekst').innerText = 'Welkom bij het Interplanetary Transport System! <br>  Hier vindt u alle informatie over de landing. Deze vindt over ongeveer 8 uur plaats. Hiernaast ziet u het terrein waar geland gaat worden. Kijk uit voor rotsen!<br> Daaronder vindt de geografische ligging van de landingsplaats.';
    // Change the link text to View.
}