
const googleMapsApiKey = window.__ENV.GOOGLE_MAPS_API_KEY;
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);