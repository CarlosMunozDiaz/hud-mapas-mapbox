//Variables globales
let map;
let currentBtn = 'btnZonasVerdesBA', currentLegend = 'ldZonasVerdesBA';

initData();

document.getElementById('btnZonasVerdesBA').addEventListener('click', function () {
    if(currentBtn != 'btnZonasVerdesBA') {
        //Cambio variables
        currentBtn = 'btnZonasVerdesBA';
        currentLegend ='ldZonasVerdesBA';

        //Ejecución funciones
        setBtn(currentBtn);
        setLegend(currentLegend);
        updateMap('buenos_pop_overcrowd');
    }    
});

document.getElementById('btnCallesBA').addEventListener('click', function () {
    if(currentBtn != 'btnCallesBA') {
        //Cambio variables
        currentBtn = 'btnCallesBA';
        currentLegend ='ldCallesBA';

        //Ejecución funciones
        setBtn(currentBtn);
        setLegend(currentLegend);
        updateMap('buenos_roads_distance');
    }
});

//Funciones del mapa
function initData() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9tdW5veiIsImEiOiJjazcwZW8wZ2sxZWFyM2VtdnQwdjVpMXBuIn0.ltacbidw9otoDaT1RLCNcA';
    map = new mapboxgl.Map({
        container: 'mapbox',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-34.6158037, -58.5033387],
        zoom: 9
    });

    map.on('load', function() {
        console.log("Entra");
        //Fuente de datos
        map.addSource('ba_greenspace', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.8z3ymagb'
        });

        //Layer
        map.addLayer(
            {
            'id': 'layer_ba_greenspace',
            'source': 'ba_greenspace',
            'source-layer': 'buenos_pop_overcrowd-7v3q8c',
            'type': 'fill',
            'paint': {
                'fill-color': "red",
                'fill-opacity': 0.75
            }
            }
        );

        console.log(map.getLayer('layer_ba_greenspace'));
        
    });
}

function updateMap(tipo) {
    console.log(tipo);
}

function setBtn(btn) {
    let btns = document.getElementsByClassName('btn');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    document.getElementById(btn).classList.add('active');
}

function setLegend(legend) {
    let legends = document.getElementsByClassName('legend');
    for (let i = 0; i < legends.length; i++) {
        legends[i].classList.remove('active');
    }
    document.getElementById(legend).classList.add('active');
}

/* Helpers */
function projectPoint(x, y) {
    let point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}