var map; var feature; var hostMarker;
var hostName, championName;
// When the document is ready
            $(document).ready(function () {
                
                $('#year_picker').datepicker({
                    minViewMode: 'years',
                    autoclose: true,
                     format: 'yyyy'
                });
                updateMap();
            });

var config = {
            apiKey: "AIzaSyCeNsxZBlZm0XabOdKT_ROhIpI7xFsBy2Y",
            authDomain: "afcon-db.firebaseapp.com",
            databaseURL: "https://afcon-db.firebaseio.com",
            projectId: "afcon-db",
            storageBucket: "afcon-db.appspot.com",
            messagingSenderId: "348263747069"
        };
firebase.initializeApp(config);
var db = firebase.database();
mapboxgl.accessToken = 'pk.eyJ1IjoibXlyYXNpbmhhIiwiYSI6ImNqbTBvaXEwbzI2dGczd2xpYXI4bTh5ODgifQ.8qZPyKRB1r5ywvK1h6RHnA';
var count = 0;

function updateMap() {
    ++count;
    year = $('#year_picker').val();
        db.ref('/'+year).once('value').then(function(snapshot) {
            hostName = snapshot.val().host;
            //console.log(hostName);
            championName = snapshot.val().champion;
            //console.log(championName);
            var mapboxClient = mapboxSdk({
                accessToken: mapboxgl.accessToken
            });
            mapboxClient.geocoding.forwardGeocode({
                    query: hostName,
                    autocomplete: false,
                    limit: 1
                })
                .send()
                .then(function(response) {
                    if (response && response.body && response.body.features && response.body.features.length && count==1) {
                        feature = response.body.features[0];

                        map = new mapboxgl.Map({
                            container: 'map',
                            style: 'mapbox://styles/myrasinha/cjm2fenke8ziq2snxi2e0h9xk',
                            center: feature.center,
                            zoom: 7.0,
                            maxBounds: [
                                [-180, -90],
                                [180, 90]
                            ]
                        });
                        map.addControl(new MapboxGeocoder({
                        accessToken: mapboxgl.accessToken
                    }));
                        hostMarker = new mapboxgl.Marker()
                        .setLngLat(feature.center)
                        .addTo(map);
                    }
                else if (response && response.body && response.body.features && response.body.features.length && count>1){
                    feature = response.body.features[0];
                        hostMarker.remove();
                    hostMarker = new mapboxgl.Marker()
                        .setLngLat(feature.center)
                        .addTo(map);
                    map.setCenter(feature.center);
                }
                console.log(hostName);

                });
        });
}


