var map; var feature; var hostMarker;
var hostName, championName;



document.getElementById("map").style.height = window.innerHeight + "px";

// When the document is ready
            $(document).ready(function () {
                $('.sidenav').sidenav();
                $('select').formSelect();
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
            if(Array.isArray(hostName)) {
                document.getElementById("hostContainer").innerHTML ="<h5>Host</h5>";
                for(i=1; i<hostName.length; i++)
                    document.getElementById("hostContainer").innerHTML += "<p>"+hostName[i]+"</p>"
            }
            else {
                document.getElementById("hostContainer").innerHTML ="<h5>Host</h5>";
                document.getElementById("hostContainer").innerHTML += "<p>"+hostName+"</p>";
            }
            console.log(hostName);
            //console.log(hostName);
            championName = snapshot.val().champion;
            document.getElementById("championContainer").innerHTML ="<h5>Champion</h5>";
            document.getElementById("championContainer").innerHTML += "<p>"+championName+"</p>";
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


