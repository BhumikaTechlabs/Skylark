var map;
var feature;
var hostMarker = [];
var countryName, countryCode, containerName, containerTitle, countryData;
var count = 0;

// Get height
document.getElementById("map").style.height = window.innerHeight + "px";

// When the document is ready
$(document).ready(function ()
{
	//$('.sidenav').sidenav();
	$('select').formSelect();
	updateUI();
});

// Firebase DB
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

// Mapbox config
mapboxgl.accessToken = 'pk.eyJ1IjoibXlyYXNpbmhhIiwiYSI6ImNqbTBvaXEwbzI2dGczd2xpYXI4bTh5ODgifQ.8qZPyKRB1r5ywvK1h6RHnA';

function updateUI()
{
	year = $('#year_picker').val();
	db.ref('/' + year).once('value').then(function (snapshot)
	{
		// ******* Left panel updates *******

		// (1) Host section update
		countryData = snapshot.val().host_code;
		cname = snapshot.val().host;
		containerName = "hostContainer";
		containerTitle = "Host";
		document.getElementById(containerName).innerHTML = "<div style='background: #00FF00; width: 20px; height: 20px; display: inline-block; margin-right: 5px'></div><h5 style='display: inline-block'>Host</h5><br/>";
		if (Array.isArray(countryData))
		{
			for (i = 1; i < countryData.length; i++)
			{
				document.getElementById(containerName).innerHTML += '<img src="flags/4x3/' + countryData[i] + '.svg" style="width:40px; height: 25px; display: inline-block; margin-right: 5px;" title="'+cname[i]+'"/>';
				console.log("Host ---> " + countryData[i]);
			}
		}
		else
		{
			document.getElementById(containerName).innerHTML += '<img src="flags/4x3/' + countryData + '.svg" style="width:40px; height: 25px; display: inline-block; margin-right: 5px;" title="'+cname+'"/>';
			console.log("Host ---> " + countryData);
		}

		// (2) Champion section update
		countryName = snapshot.val().champion_code;
		cname = snapshot.val().champion;
		containerName = "championContainer";
		containerTitle = "Champion";
		document.getElementById(containerName).innerHTML = "<div style='background: #FF0000; width: 20px; height: 20px; display: inline-block; margin-right: 5px'></div><h5 style='display: inline-block'>Champion</h5><br/>";
		document.getElementById(containerName).innerHTML += '<img src="flags/4x3/' + countryName + '.svg" style="width:40px; height: 25px; display: inline-block; margin-right: 5px;" title="'+cname+'"/>';
		console.log("Champion ---> " + countryName);

		// (3) Debutant section update
		countryData = snapshot.val().debutant_code;
		cname = snapshot.val().debutant;
		containerName = "debutantContainer";
		containerTitle = "Debutant";
		if(countryData!=null)
		{
		document.getElementById(containerName).innerHTML = "<div style='background: #0000FF; width: 20px; height: 20px; display: inline-block; margin-right: 5px'></div><h5 style='display: inline-block'>Debutant</h5><br/>";
		if (Array.isArray(countryData))
		{
			for (i = 1; i < countryData.length; i++)
			{
				document.getElementById(containerName).innerHTML += '<img src="flags/4x3/' + countryData[i] + '.svg" style="width:40px; height: 25px; display: inline-block; margin-right: 5px;" title="'+cname[i]+'"/>';
				console.log("Host ---> " + countryData[i]);
			}
		}
		else
		{
			document.getElementById(containerName).innerHTML += '<img src="flags/4x3/' + countryData + '.svg" style="width:40px; height: 25px; display: inline-block; margin-right: 5px;" title="'+cname+'"/>';
			console.log("Host ---> " + countryData);
		}
		}
		else
		{
			document.getElementById(containerName).innerHTML = "<div style='background: #0000FF; width: 20px; height: 20px; display: inline-block; margin-right: 5px'></div><h5 style='display: inline-block'>Debutant</h5><br/><p style='font-size: 20px'>None</p>";
		}

		// ******* Map panel update *******
		var mapboxClient = mapboxSdk(
		{
			accessToken: mapboxgl.accessToken
		});

		// clear the map
		if (hostMarker.length > 0)
		{
			for (i = 0; i < hostMarker.length; i++)
				hostMarker[i].remove();
			hostMarker = [];
		}

		// add host markers
		countryName = snapshot.val().host;
		if (!Array.isArray(countryName))
			updateMap(mapboxClient, countryName, 0, 255, 0);
		else
		{
			for (i = 1; i < countryName.length; i++)
				updateMap(mapboxClient, countryName[i], 0, 255, 0);
		}
		// add champion markers
		countryName = snapshot.val().champion;
		if (!Array.isArray(countryName))
			updateMap(mapboxClient, countryName, 255, 0, 0);
		else
		{
			for (i = 1; i < countryName.length; i++)
				updateMap(mapboxClient, countryName[i], 255, 0, 0);
		}
		// add debutant markers
		countryName = snapshot.val().debutant;
		if (!Array.isArray(countryName) && countryName != null)
			updateMap(mapboxClient, countryName, 0, 0, 255);
		else if(Array.isArray(countryName))
		{
			for (i = 1; i < countryName.length; i++)
				updateMap(mapboxClient, countryName[i], 0, 0, 255);
		}
	});
}

function updateMap(mapboxClient, country, r, g, b)
{
	mapboxClient.geocoding.forwardGeocode(
		{
			query: country,
			autocomplete: false,
			limit: 1
		})
		.send()
		.then(function (response)
		{
			if (response && response.body && response.body.features && response.body.features.length && count == 0)
			{
				++count;
				feature = response.body.features[0];
				map = new mapboxgl.Map(
				{
					container: 'map',
					style: 'mapbox://styles/mapbox/dark-v9',
					center: feature.center,
					zoom: 2.0,
					maxBounds: [
						[-180, -90],
						[180, 90]
					],
					attributionControl: false
				});

				// add geocoder
				map.addControl(new MapboxGeocoder(
				{
					accessToken: mapboxgl.accessToken
				}));

				// add nav control
				map.addControl(new mapboxgl.NavigationControl());

				// add curr loc button
				map.addControl(new mapboxgl.GeolocateControl(
				{
					positionOptions:
					{
						enableHighAccuracy: true
					},
					trackUserLocation: true
				}));
			}
			else if (response && response.body && response.body.features && response.body.features.length && count > 0)
			{
				feature = response.body.features[0];
			}

			// create the popup
			var popup = new mapboxgl.Popup(
				{
					offset: 25
				})
				.setText(country);

			hostMarker.push(new mapboxgl.Marker(
				{
					color: `rgb(` + r + `, ` + g + `, ` + b + `)`
				})
				.setLngLat(feature.center)
				.setPopup(popup)
				.addTo(map));

			map.flyTo(
			{
				center: feature.center
			});

		});
}
