import createRegisto from "./registo.js";

class GeoCoordinates extends HTMLElement {
    constructor() {
        super();

        // Create a Shadow DOM for the custom element
        const shadowRoot = this.attachShadow({ mode: "open" });

        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Variavel que aponta para os ficheiros css e json
        const css = this.getAttribute("css");
        const json = this.getAttribute("json");
        const pointers_string = this.getAttribute("pointers");
        const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

        // Fetch data from JSON and populate the elements
        this.fetchData(json)
            .then(data => this.populateElements(data, css, pointers))
            .catch(error => this.handleError(error));
    }



    async fetchData(json) {
      try {
          const response = await fetch(json);
          return await response.json();
      } catch (error) {
          throw error;
      }
    }



    getTemplate() {
      const template = document.createElement("template");
      template.innerHTML = `
        <div class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
          <div id="geo_coordinates"></div>
          <div id="div_map" class="map" style="height: 300px;"></div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);
      const geo_coordinates = shadowRoot.getElementById("geo_coordinates");
      const div_map = shadowRoot.getElementById("div_map");
        
      // Access the nested structure using the parts
      let path = "";
      let lastKey = "";

      const pointerPath = pointers[0].path;

      if (typeof pointerPath === 'string' && pointerPath.trim() !== '') {
        // Use uma expressão regular para encontrar todas as ocorrências de texto entre colchetes
        const keys = pointerPath.match(/\w+/g);
    
        if (keys && keys.length > 0) {
            let currentData = data;
    
            for (let i = 0; i < keys.length; i++) {
                lastKey = keys[i];
                currentData = currentData[lastKey];
            }
    
            path = currentData;
        }
    } else {
        path = data;
    }

      
        if (path.latitude && path.longitude){
          
          const div = document.createElement("div")
          div.classList.add("padding", "in-line-container","MBzero")
          
          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "location-outline");
  
          const registoInstance = createRegisto("geoCoordinates","", `Localização Absoluta: ${path.latitude}, ${path.longitude}`, "");
          
          var map = L.map(div_map, {
              center: [path.latitude, path.longitude],
              zoom: 14,   
              zoomControl: false  // Disable the default zoom control
          });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
      
          L.marker([path.latitude, path.longitude]).addTo(map)

          L.control.zoom({ position: 'bottomright' }).addTo(map);

          div.appendChild(icon);
          div.appendChild(registoInstance);

          geo_coordinates.appendChild(div)
        }
      }
    

    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("geo-coordinates-component", GeoCoordinates);