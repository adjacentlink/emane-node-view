/*
 * Copyright (c) 2019,2021 - Adjacent Link LLC, Bridgewater, New Jersey
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * * Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in
 *   the documentation and/or other materials provided with the
 *   distribution.
 * * Neither the name of Adjacent Link LLC nor the names of its
 *   contributors may be used to endorse or promote products derived
 *   from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var L = require('leaflet');
var io = require('socket.io-client')


var icons = [];
var node_markers = new Map();
var node_names = new Map();
var polylines = [];
var show_labels = false;

// Initialize the map
var map = L.map('map', {
    scrollWheelZoom: true
});

// Set the position and zoom level of the map
map.fitWorld();

// Set base layers
var esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 16
}).addTo(map);

var esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var base_layers = {
    "ESRI National Geographic": esri_NatGeoWorldMap,
    "ESRI World Imagery": esri_WorldImagery
};

var link_layer_group = L.layerGroup()

var label_layer_group = L.layerGroup()
    .on('add',
        function() {
            for(var [id, marker] of node_markers.entries())
            {
                marker.bindTooltip(node_names.get(id),{permanent: true, direction: 'top', opacity:.9});
                show_labels = true;
            }
        })
    .on('remove',
        function() {
            for(var [id, marker] of node_markers.entries())
            {
                marker.unbindTooltip();
                show_labels = false;
            }
        });


var link_layers = {
    "Links": link_layer_group,
    "Labels": label_layer_group,
};

L.control.layers(base_layers,link_layers).addTo(map);

// default on
map.addLayer(link_layer_group)

// Create a socket instance
var socket = new io('ws:///api',{reconnect: true});

// Open the socket
socket.on("connect", function(event) {

    socket.on("disconnect",function(event) {
        // clear state all state
        polylines = []

        link_layer_group.clearLayers();

        for(var [id, marker] of node_markers.entries())
        {
            map.removeLayer(marker)
        }

        node_markers.clear();
        node_names.clear();

        map.fitWorld();
    });

    socket.on('update', function(data) {
        var obj = JSON.parse(data);

        var cache = new Set(node_markers.keys())

        for(var i = 0; i < obj.length; ++i)
        {
            if(!node_markers.size)
            {
                map.setView([obj[0].lat, obj[0].lon], 7);
            }

            if(!icons[obj[i].color])
            {
                // https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color/40870439#40870439
                icons[obj[i].color] = new L.divIcon({
                    className: `pin-${obj[i].color}`,
                    iconAnchor: [0, 24],
                    popupAnchor: [2, -40],
                    tooltipAnchor: [-20, -40],
                    html: `<span style="background-color: ${obj[i].color};
                                       width: 2rem;
                                       height: 2rem;
                                       display: block;
                                       left: -1rem;
                                       top: -1rem;
                                       position: relative;
                                       border-radius: 2rem 2rem 0;
                                       transform: rotate(45deg);
                                       border: 1px solid #FFFFFF"/>`
                });
            }

            var label = `${obj[i].name}: (${obj[i].lat},${obj[i].lon},${obj[i].alt})`

            if(!node_markers.has(obj[i].id))
            {
                node_markers.set(obj[i].id, L.marker([obj[i].lat, obj[i].lon],
                                                     {icon: icons[obj[i].color]}).bindPopup(label).addTo(map));

                node_names.set(obj[i].id,`${obj[i].name}`);

                if(show_labels)
                {
                    node_markers.get(obj[i].id).bindTooltip(`${obj[i].name}`,{permanent: true, direction: 'top', opacity:.9});
                }
            }
            else
            {
                node_markers.get(obj[i].id).setLatLng([obj[i].lat, obj[i].lon]).bindPopup(label).update();
                cache.delete(obj[i].id)
            }
        }

        // remove any stale node markers
        for(let entry of cache)
        {
            map.removeLayer(node_markers.get(entry))
            node_markers.delete(entry)
            node_names.delete(entry)
        }

        polylines = []

        link_layer_group.clearLayers();

        for(var i = 0; i < obj.length; ++i)
        {
            for(var j = 0; j < obj[i].links.length; ++j)
            {
                if(node_markers.has(obj[i].links[j].remote))
                {
                    var a = node_markers.get(obj[i].id).getLatLng();
                    var b = node_markers.get(obj[i].links[j].remote).getLatLng();
                    var bounds = L.latLngBounds(a,b);
                    var link_color = obj[i].link_color;
                    if(obj[i].links[j].hasOwnProperty('color'))
                    {
                        link_color = obj[i].links[j].color;
                    }
                    polylines.push(L.polyline([a,bounds.getCenter()],
                                              {color: link_color}).addTo(link_layer_group));
                    polylines.push(L.polyline([bounds.getCenter(),b],
                                              {color: link_color, dashArray: '5'}).addTo(link_layer_group));
                }
            }
        }

    });
});
