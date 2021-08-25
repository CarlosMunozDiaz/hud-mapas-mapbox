//Variables globales
let mapBA;
let currentBtnBA = 'btnZonasVerdesBA', currentLegendBA = 'ldZonasVerdesBA';

initDataBA();

document.getElementById('btnZonasVerdesBA').addEventListener('click', function () {
    if(currentBtnBA != 'btnZonasVerdesBA') {
        //Cambio variables
        currentBtnBA = 'btnZonasVerdesBA';
        currentLegendBA ='ldZonasVerdesBA';

        //Ejecución funciones
        setBtnBA(currentBtnBA);
        setLegendBA(currentLegendBA);
        updateMapBA('buenos_pop_overcrowd');
    }    
});

document.getElementById('btnCallesBA').addEventListener('click', function () {
    if(currentBtnBA != 'btnCallesBA') {
        //Cambio variables
        currentBtnBA = 'btnCallesBA';
        currentLegendBA ='ldCallesBA';

        //Ejecución funciones
        setBtnBA(currentBtnBA);
        setLegendBA(currentLegendBA);
        updateMapBA('buenos_roads_distance');
    }
});

//Funciones del mapa
function initDataBA() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9tdW5veiIsImEiOiJjazcwZW8wZ2sxZWFyM2VtdnQwdjVpMXBuIn0.ltacbidw9otoDaT1RLCNcA';
    mapBA = new mapboxgl.Map({
        container: 'mapboxBA',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-58.5033387, -34.6158037],
        minZoom: 9,
        zoom: 9
    });

    mapBA.on('load', function() {
        //Fuente de datos
        mapBA.addSource('ba_greenspace', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.8z3ymagb'
        });

        //Segunda fuente de datos > Ahora mismo tenemos el zoom especificado > Cambiar
        mapBA.addSource('ba_roads', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.3vcrombp'
        });

        //Layer > Espacios verdes
        mapBA.addLayer(
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
        mapBA.addLayer({
            'id': 'layer_ba_roads',
            'source': 'ba_roads',
            'source-layer': 'buenos_roads_distance',
            'layout': {'visibility': 'none'},           
            'type': 'line',
            'paint': {
                'line-color': [
                    'step',
                    ['get', 'Hub distan'],
                    'blue',
                    500,
                    'green',
                    1000,
                    'yellow',
                    1500,
                    'red'
                ],
                'line-width': 1.25
            }
        });
    });
}

function updateMapBA(tipo) {
    if (tipo == 'buenos_pop_overcrowd') {
        mapBA.setLayoutProperty('layer_ba_roads', 'visibility', 'none');
        mapBA.setLayoutProperty('layer_ba_greenspace', 'visibility', 'visible');
    } else {
        mapBA.setLayoutProperty('layer_ba_greenspace', 'visibility', 'none');
        mapBA.setLayoutProperty('layer_ba_roads', 'visibility', 'visible');
    }
}

function setBtnBA(btn) {
    let btns = document.getElementsByClassName('btn-ba');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    document.getElementById(btn).classList.add('active');
}

function setLegendBA(legend) {
    let legends = document.getElementsByClassName('legend-ba');
    for (let i = 0; i < legends.length; i++) {
        legends[i].classList.remove('active');
    }
    document.getElementById(legend).classList.add('active');
}