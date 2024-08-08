var map;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find the first geo-coordinates-component element
    const firstComponent = document.querySelector('geo-coordinates-component');

    // Initialize the map for the first geo-coordinates-component
    if (firstComponent) {
        initMapFromComponent(firstComponent);
    }
});



function initMap(latitude, longitude) {
    // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates in the JSON data.');
        return;
    }

    map = L.map('map_div', {
        center: [latitude, longitude],
        zoom: 14,
        zoomControl: false  // Disable the default zoom control
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Context Location`)
        .on('mouseover', function () {
            marker.openPopup();})
        .on('click', function () {
            alert('Marker clicked!');});

    // Customize the position of the zoom control to the bottom right corner
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add circles for the remaining geo-coordinates-components
    const components = document.querySelectorAll('geo-coordinates-component');
    for (let i = 1; i < components.length; i++) {
        let component = components[i];
        let jsonPath = component.getAttribute('json');
        let pointers = JSON.parse(component.getAttribute('pointers'));

        fetch(jsonPath)
        .then(response => response.json())
        .then(jsonData => {
            // Extract coordinates based on pointers
            let coordinates = extractCoordinates(jsonData, pointers);

            // Check if coordinates are valid
            if (!isNaN(coordinates.latitude) && !isNaN(coordinates.longitude)) {
                // Add a marker for each subsequent component
                var marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map)
                    .bindPopup(`Context Location`)
                    .on('mouseover', function () {
                        marker.openPopup();})
                    .on('click', function () {
                        alert('Marker clicked!');});
            } else {
                console.error('Invalid coordinates in the JSON data.');
            }
            
        }).catch(error => {
            console.error('Error loading JSON data:', error);
        });
    }
}



// Function to initialize the map based on geo-coordinates-2-component attributes
function initMapFromComponent(component) {
    // Retrieve JSON path and pointers from attributes
    const jsonPath = component.getAttribute('json');
    const pointers = JSON.parse(component.getAttribute('pointers'));

    // Load JSON data (adapt this based on your actual logic)
    fetch(jsonPath)
        .then(response => response.json())
        .then(jsonData => {
            // Extract coordinates based on pointers
            const coordinates = extractCoordinates(jsonData, pointers);

            // Check if coordinates are valid
            if (!isNaN(coordinates.latitude) && !isNaN(coordinates.longitude)) {
                // Initialize the map with the extracted coordinates
                initMap(coordinates.latitude, coordinates.longitude);

            } else {
                console.error('Invalid coordinates in the JSON data.');
            }
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
}



// Function to extract coordinates based on pointers
function extractCoordinates(data, pointers) {
    let result = data;

    // Access the nested structure using the parts
    let path = "";
    let lastKey = "";

    const pointerPath = pointers[0].path;

    if (typeof pointerPath === 'string') {
      // Use a regular expression to find all occurrences of text between brackets
      const keys = pointerPath.match(/\w+/g);

      if (keys && keys.length > 0) {
        let currentData = data;

        for (let i = 0; i < keys.length; i++) {
          lastKey = keys[i];
          currentData = currentData[lastKey];
        }

        path = currentData;
      }
    }

    return path;
}





document.addEventListener("DOMContentLoaded", function() {
    // Get a reference to the div
    var mapaDiv = document.getElementById("mapa");

    // Attach the onload function to the div
    if (mapaDiv) {
        initMapFromComponent(mapaDiv);
    }
});



// Function to initialize the map based on geo-coordinates-2-component attributes
function initMapFromComponent(component) {
    // Retrieve JSON path and pointers from attributes
    const jsonPath = component.getAttribute('json');
    const pointers = JSON.parse(component.getAttribute('pointers'));

    // Load JSON data (adapt this based on your actual logic)
    fetch(jsonPath)
        .then(response => response.json())
        .then(jsonData => {
            // Extract coordinates based on pointers
            const coordinates = extractCoordinates(jsonData, pointers);

            // Check if coordinates are valid
            if (!isNaN(coordinates.latitude) && !isNaN(coordinates.longitude)) {
                // Initialize the map with the extracted coordinates
                initMap(coordinates.latitude, coordinates.longitude);

            } else {
                console.error('Invalid coordinates in the JSON data.');
            }
        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
}



// Function to extract coordinates based on pointers
function extractCoordinates(data, pointers) {
    let result = data;

    // Access the nested structure using the parts
    let path = "";
    let lastKey = "";

    const pointerPath = pointers[0].path;

    if (typeof pointerPath === 'string') {
      // Use a regular expression to find all occurrences of text between brackets
      const keys = pointerPath.match(/\w+/g);

      if (keys && keys.length > 0) {
        let currentData = data;

        for (let i = 0; i < keys.length; i++) {
          lastKey = keys[i];
          currentData = currentData[lastKey];
        }

        path = currentData;
      }
    }

    return path;
}