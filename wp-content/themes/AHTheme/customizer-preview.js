function myMap() {
    var mapDiv = document.getElementById('mapDiv');
    var mapOptions = {
        center: {lat: -34.397, lng: 150.644}, // Example coordinates
        zoom: 8 // Example zoom level
    };
    var map = new google.maps.Map(mapDiv, mapOptions);
}
