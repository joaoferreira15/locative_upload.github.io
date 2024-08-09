import { fetchData, getPathFromPointers, updateValue, windowSize, isValidJsonString } from "./lib/functions.js"

class Circuit extends HTMLElement {
    static circuitList = [];
    static map;

    constructor() {
        super();

        // Create a Shadow DOM for the custom element
        const shadowRoot = this.attachShadow({ mode: "open" });

        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Variavel que aponta para os ficheiros css e json
        const css = this.getAttribute("css");
        const json = this.getAttribute("json");
        let pattern = this.getAttribute("pattern");
        const pointers_string = this.getAttribute("pointers");
        const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

        // Navigate Event needed to construct the map markers
        if (pattern != "fixed" || pattern == null) {
            window.addEventListener('load', () => {
                const screenWidth = window.innerWidth;
                const pattern = this.getAttribute("pattern");

                // Adjust attributes based on screen width
                console.log("Inputs", screenWidth, pattern)
                if (screenWidth < 900) {
                    console.log(true)
                    if (!pattern) {
                        console.log(true)
                        this.setAttribute("pattern", "0");
                        this.setAttribute("pattern", "1");
                    }
                    else if (pattern != "1") {
                        this.clearMapElements();
                        this.setAttribute("pattern", "1");
                    }
                    else { return }
                } else if (screenWidth >= 900) {
                    if (!pattern) {
                        this.setAttribute("pattern", "0");
                        this.setAttribute("pattern", "2");
                    }
                    else if (pattern != "2") {
                        this.clearMapElements();
                        this.setAttribute("pattern", "2");
                    }
                    else { return }
                }
            });
        }

        if (pattern != "fixed") {

            window.addEventListener('resize', () => {
                const screenWidth = window.innerWidth;
                const pattern = this.getAttribute("pattern");

                // Adjust attributes based on screen width
                //console.log("Inputs", screenWidth, pattern)
                if (screenWidth < 900) {
                    if (pattern != "1") {
                        this.clearMapElements();
                        this.setAttribute("pattern", "1");
                    }
                } else if (screenWidth >= 900) {
                    if (pattern != "2") {
                        this.clearMapElements();
                        this.setAttribute("pattern", "2");
                    }
                }
            });
        }

        pattern = this.getAttribute("pattern");
        console.log("pattern", pattern)

        if (isValidJsonString(json)) {
            try {
                const data = JSON.parse(json);
                this.populateElements(data, css, pointers, pattern);
            } catch (error) {
                this.handleError(error);
            }
        } else {
            fetchData(json)
                .then(data => this.populateElements(data, css, pointers, pattern))
                .catch(error => this.handleError(error));
        }
    }



    clearMapElements() {
        Circuit.map = null
        const divMap = this.shadowRoot.getElementById("div_map")
        if(divMap) { divMap.remove(); }
    }



    static get observedAttributes() {
        // Lista de atributos que você deseja observar as mudanças
        return ['css', "json", "pointers", "pattern", "id"];
    }



    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
        if (oldValue !== newValue && oldValue !== null) { updateValue(this, name, newValue); }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div id="map-general" class="circuit-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        </div>
      `;
        return template;
    }



    populateElements(data, css, pointers, pattern) {
        const shadowRoot = this.shadowRoot;

        if (css.startsWith("static") || css.startsWith("https")) {
            shadowRoot.getElementById("styleDiv").innerHTML = "";
            shadowRoot.getElementById("css").setAttribute("href", css);
        } else {
            shadowRoot.getElementById("css").setAttribute("href", "");
            shadowRoot.getElementById("styleDiv").innerHTML = css;
        }

        const container = shadowRoot.getElementById("map-general");

        if (pattern == "2" || pattern == "fixed") {
            const div_map = document.createElement("div")
            div_map.setAttribute("id", "div_map")
            div_map.classList.add("small-map", "border-map")
            container.appendChild(div_map)

            // Access the nested structure using the parts
            let keysToSearchList = ["circuit"];
            const resultList = getPathFromPointers(data, pointers, keysToSearchList);
            let isFirstIteration = true;

            for (let i = 0; i < resultList.length; i++) {
                const { path, lastKey } = resultList[i];

                let pathCircuit = ""
                if (lastKey == "circuit" && !path.circuit) { pathCircuit = path } else if (path.circuit) { pathCircuit = path.circuit }

                //console.log("Path", path)
                pathCircuit.forEach(item => {
                    //console.log("item", item)
                    if (item.latitude && item.longitude) {
                        if (isFirstIteration) {
                            //console.log("coords", item.latitude, item.longitude)
                            
                            Circuit.map = L.map(div_map, {
                                center: [item.latitude, item.longitude],
                                zoom: 14,
                                zoomControl: false  // Disable the default zoom control
                            });

                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            }).addTo(Circuit.map);

                            // Customize the position of the zoom control to the bottom right corner
                            L.control.zoom({ position: 'bottomright' }).addTo(Circuit.map);

                            Circuit.circuitList.push([item.latitude, item.longitude])

                            isFirstIteration = false;
                        } else {
                            Circuit.circuitList.push([item.latitude, item.longitude])
                        }
                    }
                });
            }
            //console.log("list", Circuit.circuitList)
            // Add polyline to represent transit route
            const polyline = L.polyline(Circuit.circuitList.map(pt => [pt[0], pt[1]]), { color: 'red' }).addTo(Circuit.map);
            // Fit map to polyline bounds
            Circuit.map.fitBounds(polyline.getBounds());
        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("circuit-component", Circuit);