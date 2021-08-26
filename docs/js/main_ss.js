//Variables globales
let mapSS, popupSS;
let currentBtnSS = 'btnZonasVerdesSS', currentLegendSS = 'ldZonasVerdesSS';

initDataSS();

document.getElementById('btnZonasVerdesSS').addEventListener('click', function () {
    if(currentBtnSS != 'btnZonasVerdesSS') {
        //Cambio variables
        currentBtnSS = 'btnZonasVerdesSS';
        currentLegendSS ='ldZonasVerdesSS';

        //Ejecución funciones
        setBtnSS(currentBtnSS);
        setLegendSS(currentLegendSS);
        updatemapSS('salvador_pop_overcrowd');
    }    
});

document.getElementById('btnCallesSS').addEventListener('click', function () {
    if(currentBtnSS != 'btnCallesSS') {
        //Cambio variables
        currentBtnSS = 'btnCallesSS';
        currentLegendSS ='ldCallesSS';

        //Ejecución funciones
        setBtnSS(currentBtnSS);
        setLegendSS(currentLegendSS);
        updatemapSS('salvador_roads_distance');
    }
});

//Funciones del mapa
function initDataSS() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9tdW5veiIsImEiOiJjazcwZW8wZ2sxZWFyM2VtdnQwdjVpMXBuIn0.ltacbidw9otoDaT1RLCNcA';
    mapSS = new mapboxgl.Map({
        container: 'mapboxSS',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-89.184, 13.740],
        minZoom: 10,
        zoom: 11
    });

    /* Tooltip */
    popupSS = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    const nav = new mapboxgl.NavigationControl({showCompass: false});
    mapSS.addControl(nav, 'top-right');

    mapSS.on('load', function() {
        //Fuente de datos
        mapSS.addSource('ss_greenspace', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.5e6solxl'
        });

        //Segunda fuente de datos > Ahora mismo tenemos el zoom especificado > Cambiar
        mapSS.addSource('ss_roads', {
            'type': 'vector',
            'url': 'mapbox://carlomunoz.9jjf5mkz'
        });

        //Layer > Espacios verdes
        mapSS.addLayer(
            {
            'id': 'layer_ss_greenspace',
            'source': 'ss_greenspace',
            'source-layer': 'salvador_pop_overcrowd-4sr8g5',
            'layout': {'visibility': 'visible'},
            'type': 'fill',
            'paint': {
                'fill-color': "green",
                'fill-opacity': 0.75
            }
            }
        );
        
        //Layer > Callejero
        mapSS.addLayer({
            'id': 'layer_ss_roads',
            'source': 'ss_roads',
            'source-layer': 'san_roads_distance-5dowds',
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

        //Dejar para hacerlo solo en mobile
        if(window.innerWidth < 575) {
            mapSS.scrollZoom.disable();
        }        

        //Popup
        bind_event_ss('layer_ss_greenspace');
        bind_event_ss('layer_ss_roads');
    });
}

function updatemapSS(tipo) {
    if (tipo == 'salvador_pop_overcrowd') {
        mapSS.setLayoutProperty('layer_ss_roads', 'visibility', 'none');
        mapSS.setLayoutProperty('layer_ss_greenspace', 'visibility', 'visible');
    } else {
        mapSS.setLayoutProperty('layer_ss_greenspace', 'visibility', 'none');
        mapSS.setLayoutProperty('layer_ss_roads', 'visibility', 'visible');
    }
}

function setBtnSS(btn) {
    let btns = document.getElementsByClassName('btn-ss');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    document.getElementById(btn).classList.add('active');
}

function setLegendSS(legend) {
    let legends = document.getElementsByClassName('legend-ss');
    for (let i = 0; i < legends.length; i++) {
        legends[i].classList.remove('active');
    }
    document.getElementById(legend).classList.add('active');
}

/* TOOLTIP */
function bind_event_ss(id){
    mapSS.on('mousemove', id, function(e){
        //Comprobar el ID aquí o en la función del texto
        let propiedades = e.features[0];
        mapSS.getCanvas().style.cursor = 'pointer';
        var coordinates = e.lngLat;

        var tooltipText = get_tooltip_text_ss(propiedades, id);

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }        
        popupSS.setLngLat(coordinates)
            .setHTML(tooltipText)
            .addTo(mapSS);

        mapSS.getCanvas().style.cursor = 'pointer';
    });
    mapSS.on('mouseleave', id, function() {
        mapSS.getCanvas().style.cursor = '';
        popupSS.remove();
    });
}

function get_tooltip_text_ss(props, id) {
    let html = '';
    if(id == 'layer_ss_greenspace') {
        html = `<p>Hectáreas de esta zona: ${props.properties.area_ha}</p>`;
    } else {
        html = `<p><b>Calle ${props.properties.name}</b></p>
            <p>Distancia a una zona verde: ${props.properties['Hub distan'].toFixed(0)} metros</p>`;
    }
    return html;
}