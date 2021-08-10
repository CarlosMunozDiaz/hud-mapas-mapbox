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
        center: [-58.5033387, -34.6158037],
        minZoom: 11,
        zoom: 11
    });

    map.on('load', function() {
        //Fuente de datos
        map.addSource('ba_greenspace', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.8z3ymagb'
        });

        //Segunda fuente de datos > Ahora mismo tenemos el zoom especificado > Cambiar
        map.addSource('ba_roads', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.5liz8p83'
        });

        //Layer > Espacios verdes
        map.addLayer(
            {
            'id': 'layer_ba_greenspace',
            'source': 'ba_greenspace',
            'source-layer': 'buenos_pop_overcrowd-7v3q8c',
            'layout': {'visibility': 'visible'},
            'type': 'fill',
            'paint': {
                'fill-color': "green",
                'fill-opacity': 0.75
            }
            }
        );
        
        //Layer > Callejero
        map.addLayer({
            'id': 'layer_ba_roads',
            'source': 'ba_roads',
            'source-layer': 'buenos_roads_distance_3-11e3t0',
            'layout': {'visibility': 'none'},           
            'type': 'line',
            'paint': {
                'line-color': 'red',
                'line-width': .5
            }
        });
    });
}

function updateMap(tipo) {
    console.log(tipo);
    if (tipo == 'buenos_pop_overcrowd') {
        map.setLayoutProperty('layer_ba_roads', 'visibility', 'none');
        map.setLayoutProperty('layer_ba_greenspace', 'visibility', 'visible');
    } else {
        map.setLayoutProperty('layer_ba_greenspace', 'visibility', 'none');
        map.setLayoutProperty('layer_ba_roads', 'visibility', 'visible');
    }
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