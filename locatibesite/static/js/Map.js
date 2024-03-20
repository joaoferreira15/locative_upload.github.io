import { fetchData, getPathFromPointers, updateValue, windowSize } from "./lib/functions.js"

class MapComponent extends HTMLElement {
    static markerList = [];
    static map;

    constructor() {
        super();

        // Create a Shadow DOM for the custom element
        const shadowRoot = this.attachShadow({ mode: "open" });

        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Variavel que aponta para os ficheiros css e json
        const componentID = this.getAttribute("id");
        const css = this.getAttribute("css");
        const json = this.getAttribute("json");
        let pattern = this.getAttribute("pattern");
        const pointers_string = this.getAttribute("pointers");
        const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

        // Navigate Event needed to construct the map markers
        document.addEventListener("navigateToMarkerEvent", (event) => {
            const name = event.detail.name;
            const mapID = event.detail.id;
            console.log("componentID", componentID)

            if (mapID == componentID) {
                this.scrollToMarker(name);
            }

            console.log(`Received name: ${name}`);
        });

        if (pattern != "fixed" || pattern == null) {
            windowSize(this);
            pattern = this.getAttribute("pattern")

            // Pattern Event, where the map structure to use is selected
            window.addEventListener('resize', () => {
                const screenWidth = window.innerWidth;
                
                MapComponent.map = null
                const divMap = shadowRoot.getElementById("div_map")
                if (divMap) {divMap.remove();}

                // Adjust attributes based on screen width
                if (screenWidth <= 900) {
                    this.setAttribute("pattern", "1")
                } else {
                    this.setAttribute("pattern", "2")
                }
            })
        };

        fetchData(json)
            .then(data => this.populateElements(data, css, pointers, pattern, componentID))
            .catch(error => this.handleError(error));
    }



    static get observedAttributes() {
        // Lista de atributos que você deseja observar as mudanças
        return ['css', "json", "pointers", "pattern", "id"];
    }



    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
        if (oldValue !== newValue && oldValue !== null) { updateValue(this, name, newValue);}
      }



    scrollToMarker(name) {
        const markerToScroll = MapComponent.markerList.find(marker => marker.myCustomID === name);
        if (markerToScroll) {
            const markerLatLng = markerToScroll.getLatLng();

            MapComponent.map.panTo(markerLatLng);
            console.log("it should have worked")

            markerToScroll.openPopup();
        } else {
            console.error(`Marker with ID ${name} not found.`);
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div id="map-general" class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        </div>
      `;
        return template;
    }



    populateElements(data, css, pointers, pattern, componentID) {
        const shadowRoot = this.shadowRoot;
        shadowRoot.getElementById("css").setAttribute("href", css);
        const container = shadowRoot.getElementById("map-general");

        if (pattern == "2" || pattern == "fixed") {
            const div_map = document.createElement("div")
            div_map.setAttribute("id", "div_map")
            div_map.classList.add("big-map")
            container.appendChild(div_map)

            // Access the nested structure using the parts
            let keysToSearchList = ["latitude", "longitude"];
            const resultList = getPathFromPointers(data, pointers, keysToSearchList);
            let isFirstIteration = true;

            for (let i = 0; i < resultList.length; i++) {
                const { path, lastKey } = resultList[i];

                //console.log("Path", path)
                if (path.latitude && path.longitude) {
                    if (isFirstIteration) {
                        MapComponent.map = L.map(div_map, {
                            center: [path.latitude, path.longitude],
                            zoom: 14,
                            zoomControl: false  // Disable the default zoom control
                        });

                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }).addTo(MapComponent.map);

                        const marker = L.marker([path.latitude, path.longitude]).addTo(MapComponent.map)
                            .bindPopup(`Context Location`)
                            .on('mouseover', function () {
                                marker.openPopup();
                            })
                            .on('click', function () {
                                const targetId = `produto-${i}-${componentID}`;

                                window.location.hash = targetId;
                                document.getElementById(targetId).scrollIntoView({
                                    behavior: 'smooth'
                                });
                                alert(`Navigating to element with id: ${targetId}`);
                            });

                        marker.myCustomID = `produto-${i}-${componentID}`;
                        MapComponent.markerList.push(marker)

                        // Customize the position of the zoom control to the bottom right corner
                        L.control.zoom({ position: 'bottomright' }).addTo(MapComponent.map);

                        isFirstIteration = false;
                    } else {
                        const marker = L.marker([path.latitude, path.longitude]).addTo(MapComponent.map)
                            .bindPopup(`Context Location`)
                            .on('mouseover', function () {
                                marker.openPopup();
                            })
                            .on('click', function () {
                                const targetId = `produto-${i}-${componentID}`;

                                window.location.hash = targetId;
                                document.getElementById(targetId).scrollIntoView({
                                    behavior: 'smooth'
                                });
                                alert(`Navigating to element with id: ${targetId}`);
                            });

                        marker.myCustomID = `produto-${i}-${componentID}`;
                        MapComponent.markerList.push(marker)
                    }
                }
            }
            setTimeout(function() {
                MapComponent.map.invalidateSize();
            }, 100);
        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("map-component", MapComponent);