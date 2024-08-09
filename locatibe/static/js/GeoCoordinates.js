import Registo from "./lib/registo.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class GeoCoordinates extends HTMLElement {
  static mapGeo;

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


    if (pattern != "fixed" || pattern == null) {
      window.addEventListener('load', () => {
        const screenWidth = window.innerWidth;
        const pattern = this.getAttribute("pattern");

        // Adjust attributes based on screen width
        //console.log("Inputs", screenWidth, pattern)
        if (screenWidth < 900) {
          //console.log(true)
          if (!pattern) {
            //console.log(true)
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
        ////console.log("Inputs", screenWidth, pattern)
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
    //console.log("pattern", pattern)

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
    GeoCoordinates.map = null;
    const div_map_geo = this.shadowRoot.getElementById("div_map_geo");
    const geo_coordinates = this.shadowRoot.getElementById("geo_coordinates");
    if (div_map_geo) { div_map_geo.remove(); }
    geo_coordinates.innerHTML = "";
  }



  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern"];
  }



  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
    if (oldValue !== newValue && oldValue !== null) { updateValue(this, name, newValue); }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="map-geo-coordinates" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
          <div id="geo_coordinates" class="text-left"></div>
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

    const container = shadowRoot.getElementById("map-geo-coordinates");
    const geo_coordinates = shadowRoot.getElementById("geo_coordinates");

    // Access the nested structure using the parts
    let keysToSearchList = ["latitude", "longitude"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {

      if (pattern && path.latitude && path.longitude && keysToSearchList.includes("latitude") && keysToSearchList.includes("longitude")) {

        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "location-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("geoCoordinates", "", `Localização Absoluta: ${path.latitude}, ${path.longitude}`, "");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        geo_coordinates.appendChild(div)

        if (pattern == "1") {

          const div_map_geo = document.createElement("div")
          div_map_geo.setAttribute("id", "div_map_geo")
          div_map_geo.classList.add("small-map", "border-map")

          container.appendChild(div_map_geo)

          GeoCoordinates.mapGeo = L.map(div_map_geo, {
            center: [path.latitude, path.longitude],
            zoom: 14,
            zoomControl: false
          });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(GeoCoordinates.mapGeo);

          L.marker([path.latitude, path.longitude]).addTo(GeoCoordinates.mapGeo)

          L.control.zoom({ position: 'bottomright' }).addTo(GeoCoordinates.mapGeo);
        }
      }
    }
  }



  handleError(error) {
    //console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("geo-coordinates-component", GeoCoordinates);