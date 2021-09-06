//Variables globales
let mapBA, popupBA;
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

    /* Tooltip */
    popupBA = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    const nav = new mapboxgl.NavigationControl({showCompass: false});
    mapBA.addControl(nav, 'top-right');

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
                'fill-color': "#63DAAF",
                'fill-opacity': 1
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
                    '#095677',
                    500,
                    '#9B918C',
                    1000,
                    '#FEB531',
                    1500,
                    '#9CBDD2'
                ],
                'line-width': 1.25
            }
        });

        //Dejar para hacerlo solo en mobile
        // if(window.innerWidth < 575) {
        //     mapBA.dragPan.disable();
        //     mapBA.scrollZoom.disable();
        // }     

        //Popup
        bind_event_ba('layer_ba_greenspace');
        bind_event_ba('layer_ba_roads');
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

/* TOOLTIP */
function bind_event_ba(id){
    mapBA.on('mousemove', id, function(e){
        //Comprobar el ID aquí o en la función del texto
        let propiedades = e.features[0];
        mapBA.getCanvas().style.cursor = 'pointer';
        var coordinates = e.lngLat;

        var tooltipText = get_tooltip_text_ba(propiedades, id);

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }        
        popupBA.setLngLat(coordinates)
            .setHTML(tooltipText)
            .addTo(mapBA);

        mapBA.getCanvas().style.cursor = 'pointer';
    });
    mapBA.on('mouseleave', id, function() {
        mapBA.getCanvas().style.cursor = '';
        popupBA.remove();
    });
}

function get_tooltip_text_ba(props, id) {
    let html = '';
    if(id == 'layer_ba_greenspace') {
        html = `<p>Hectáreas de esta zona: ${props.properties.area_ha}</p>`;
    } else {
        html = `<p><b>Calle ${props.properties.name}</b></p>
            <p>Distancia a una zona verde: ${props.properties['Hub distan'].toFixed(0)} metros</p>`;
    }
    return html;
}