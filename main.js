document.addEventListener('DOMContentLoaded', function () {
    let currentRouteSummary = '';
    let currentRouteSteps = '';
    let userLocation = null;
    let map;
    let directionsService;
    let directionsRenderer;

    document.getElementById('aiForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const userInput = document.getElementById('prompt').value;
        const fullPrompt = `$Route Information:\nSummary: ${currentRouteSummary}\nSteps:\n${currentRouteSteps}`;
        const data = {
            user_input: fullPrompt
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/userresponse', {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            document.getElementById('response').innerText = result;
        } catch (error) {
            console.error('Error:', error);
        }
    });

    initMap();

    document.querySelector('.directions-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const destinationInput = document.getElementById('destination').value;

        try {
            const geocoder = new google.maps.Geocoder();
            const { results } = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: destinationInput }, (results, status) => {
                    if (status === 'OK') resolve({ results });
                    else reject(new Error('Geocode failed: ' + status));
                });
            });

            if (results[0]) {
                const destination = results[0].geometry.location;
                calculateAndDisplayRoute(userLocation, destination);
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('directions-panel').innerHTML = `Error: ${error.message}`;
        }
    });

    function initMap() {
        const defaultLocation = { lat: 39.1031, lng: -84.5120 };

        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation,
            zoom: 12
        });

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    getWeatherForecast(userLocation.lat, userLocation.lng);

                    map.setCenter(userLocation);
                    new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "You are here"
                    });
                },
                function () {
                    console.log('Geolocation failed, using default location');
                    userLocation = defaultLocation;
                    map.setCenter(defaultLocation);
                }
            );
        } else {
            userLocation = defaultLocation;
            map.setCenter(defaultLocation);
        }
    }

    function calculateAndDisplayRoute(origin, destination) {
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);

                    const route = response.routes[0];
                    const leg = route.legs[0];
                    currentRouteSummary = leg.distance.text + " to " + leg.end_address;
                    currentRouteSteps = leg.steps.map(step => step.instructions).join("\n");
                    const travelTime = leg.duration.text;

                    directionsRenderer.setPanel(document.getElementById('directions-panel'));
                
                    document.getElementById('travelInfo').innerHTML = `
                        <strong>Travel Time:</strong> ${travelTime}<br>
                        <strong>Distance:</strong> ${leg.distance.text}<br>
                        <strong>Destination:</strong> ${leg.end_address}
                    `;
                } else {
                    console.error('Directions request failed: ' + status);
                }
            }
        );
    }

    async function getWeatherForecast(lat, lon) {
        const apiUrl = `https://api.weather.gov/points/${lat},${lon}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const forecastUrl = data.properties.forecast;
            console.log(`Forecast URL: ${forecastUrl}`);

            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();
            const forecast = forecastData.properties.periods[0];
            console.log(`Forecast: ${forecast.detailedForecast}`);

            document.getElementById('forecast').innerText = `Today's Forecast: ${forecast.detailedForecast}`;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            document.getElementById('forecast').innerText = `Error: ${error.message}`;
        }
    }
});