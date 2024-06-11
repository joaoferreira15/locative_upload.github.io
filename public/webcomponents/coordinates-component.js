import Registo from "./lib/registo.js";
import { updateValue, isValidJsonString } from "./lib/functions.js"

class GeoCoordinates extends HTMLElement {
  static mapGeo;

  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    this.innerHTML += '<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"> <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>'

    // Variavel que aponta para os ficheiros css e json
    var css = this.getAttribute("css");
    if (!css) {
      css = `p {
    font-family: "DM Sans", Verdana, sans-serif;
}

h2 {
    font-family: "Syne", Lato, sans-serif;
}
    .centerd-text{
    text-align: center;
}
    .border-black {
  border: 1px solid black;
  }

.border-black-bottom {
  border-bottom: 1px solid black;
}

a {
    text-decoration: none;
    font-family: "Syne", Lato, sans-serif;
    color: inherit;
}

.fixed {
    position: fixed;
    top: 90px;
    width: 100%;
    z-index: 2000; /* Adjust z-index as needed */
    background-color: #EC6C5A;
}

.jsonDiv {
    overflow: auto
}

a:hover {
    color: #EC6C5A;
    text-decoration: underline
}

.custom-big-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 3px;
}

.custom-container {
    text-align: center;
}

.w-90 {
    width: 90%;
    margin: 0 auto;
}

.w-80 {
    width: 80%;
    margin: 0 auto;
}

.m-30-tb {
    margin-top: 30px;
    margin-bottom: 30px;
}

.mt-15 {
    margin-top: 15px;
}

.container-presentation{
    width: 90%;
    margin: 0 auto;
}

.custom-logo {
    width: 40%;
    height: auto;
}

.custom-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 5px; /* mb-3 spacing */
}

.custom-sub-title {
    font-size: 18px;
    margin-bottom: 3px; /* mb-3 spacing */
}

.no-mb {
    margin-bottom: 0px !important;
}

.no-mt {
    margin-top: 0px !important;
}

.m-4-tb {
    margin-top: 4px;
    margin-bottom: 5px;
}

.custom-type {
    margin-bottom: 3px; /* mb-3 spacing */
}

.custom-id {
    margin-bottom: 3px; /* mb-3 spacing */
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
}

.custom-id-col {
    margin-bottom: 3px; /* mb-3 spacing */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

.border-bottom {
    border-bottom: 1px solid #ddd;
}

.mb-10 {
    margin-bottom: 10px;
}

.mb-20 {
    margin-bottom: 20px;
}

.custom-description-top {
    border-top: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    margin-bottom: 3px;
}

.custom-description {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.text-left {
    text-align: left;
}

.circuit-container {
    margin-top: 10px;
    margin-bottom: 20px;
}

.m-10 {
margin-top: 10px;
margin-bottom: 10px;
}

.image-holder{
    width: 80px !important;
    height: 80px !important;
    overflow: hidden !important;
}

.custom-title-pages {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 3px; /* mb-3 spacing */
}

.custom-description-pages {
    font-size: 12px !important;
    margin-bottom: 3px !important; /* mb-3 spacing */
}

.custom-image {
    width: 100%;
    display: inline-block !important; 
    height: auto;
}

.lyric {
    margin: 0 auto;
    padding-top: 5px;
}

ion-icon {
    min-width: 20px;
    size: 20px;
}

#gallery-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
}

.big-map {
  height: 565px;
  /*margin-top: 10px;
  margin-bottom: 30px;*/
}

.small-map {
  height: 300px;
  /*margin-top: 10px;
  margin-bottom: 30px;*/
}

.gallery {
    box-sizing: border-box;
    margin: 5px;
}

.border {
    border: 1px solid #ddd;
}

.border-map {
    border: 1px solid #535759;
}

.border-top {
    border-top: 1px solid #ddd;
}

.custom-table {
    height: 100%;
    width: 100%;
    max-width: 600px;
    overflow: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border-collapse: collapse;
}

th {
    font-family: "DM Sans", Verdana, sans-serif;
    background-color: #333;
    color: white;
    text-align: center;
    font-weight: bold;
    padding: 8px;
    border: 1px solid #ddd;
}

td {
    font-family: "DM Sans", Verdana, sans-serif;
    text-align: center;
    border: 1px solid #ddd;
}

.leaflet-bottom {
    z-index: 10 !important;
}

.recurso-image {
  position: relative;
  height: 400px; /* Set the height according to your design */
  overflow: hidden;
}

.recurso-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.recurso-square-col {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
}

.recurso-square {
    display: flex;
    flex-direction: row;
    justify-content: left;
    text-align: left;
}

@media only screen and (max-width: 598px) {
    img.resource-image {
      width: 90%;
      margin: 0 auto;
      object-fit: cover;
    }
}

@media only screen and (max-width: 598px) {
    img.resource-image {
      width: 90%;
      margin: 0 auto;
      display: flex;
    }
}

.recurso-square img {
    max-width: 100px;
    margin-right: 20px;
}

.recurso-square h2 {
    margin-top: 0;
    font-size: 1.6em;
    line-height: 1.4;
}

.recurso-square p {
    margin-top: 0;
    margin-bottom: 1rem;
    font-family: var(--body-font);
    font-size: 16px;
    line-height: 1.5;
}

.btn-center {
    text-align: center;
    display: block;
}

.btn.btn-black {
    background-color: var(--dark-color);
    color: var(--light-color);
}

a.btn,
input[type="button"],
input[type="submit"],
input[type="reset"],
input[type="file"],
button {
  background-image: none;
  background: var(--dark-color);
  text-decoration: none !important;
  display: inline-block;
  position: relative;
  border: 2px solid transparent;
  border-radius: 0px;
  padding: 0.75em 1.5em;
  margin-top: 15px;
  font-family: var(--body-font);
  font-size: 15px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  text-transform: uppercase;
  color: var(--light-color);
  z-index: 1;
  cursor: pointer;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.btn:hover,
.btn:focus,
input[type="button"]:focus,
input[type="button"]:hover,
input[type="submit"]:focus,
input[type="submit"]:hover,
input[type="reset"]:focus,
input[type="reset"]:hover,
input[type="file"]:focus,
input[type="file"]:hover,
button:focus,
button:hover {
  text-decoration: none;
  outline: 0;
  border-color: transparent;
}

.btn {
  border-radius: 0px;
}

.btn.back-to-top .i {
  background-color: whitesmoke
}

.btn-left {
  text-align: left;
  display: block;
}

.btn-right {
  text-align: right;
  display: block;
}

#navigation-button {
  display: flex;
  justify-content: center;
  gap: 10px;
}`
    }
    var json = this.getAttribute("json");
    let pattern = this.getAttribute("pattern") || "1";

    if (isValidJsonString(json)) {
      try {
        const data = JSON.parse(json);
        this.data = data
        this.populateElements(data, css, pattern);
      } catch (error) {
        this.handleError(error);
      }
    }
  }


  connectedCallback() {
    this.loadLibraries()
      .then(() => {
        this.createMap();
      })
      .catch(error => {
        console.error("Failed to load libraries:", error);
      });
  }


  createMap() {
    const pattern = this.getAttribute("pattern") || "1";
    const data = this.data
    const shadowRoot = this.shadowRoot

    const container = shadowRoot.getElementById("map-geo-coordinates");

    if (pattern && data.coordinates) {
      console.log("map", pattern, data.coordinates)
      const latitudeCoords = data.coordinates[0]
      const longitudeCoords = data.coordinates[1]

      if (pattern == "1") {

        const div_map_geo = document.createElement("div")
        div_map_geo.setAttribute("id", "div_map_geo")
        div_map_geo.classList.add("small-map", "border-map")

        container.appendChild(div_map_geo)

        GeoCoordinates.mapGeo = L.map(div_map_geo, {
          center: [latitudeCoords, longitudeCoords],
          zoom: 14,
          zoomControl: false
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(GeoCoordinates.mapGeo);

        L.marker([latitudeCoords, longitudeCoords]).addTo(GeoCoordinates.mapGeo)

        L.control.zoom({ position: 'bottomright' }).addTo(GeoCoordinates.mapGeo);
      }
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
    return ['css', "json", "pattern"];
  }



  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
    if (oldValue !== newValue && oldValue !== null) { updateValue(this, name, newValue); }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="map-geo-coordinates" class="container custom-container border-black">
          <div id="articleId" class="border-black-bottom">
            <h2 class="centerd-text">Location</h2>
          </div>
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
          <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
          <div id="geo_coordinates" class="text-left"></div>
        </div>
      `;
    return template;
  }


  async loadLibraries() {
    // Load CSS
    const leafletCssLink = document.createElement("link");
    leafletCssLink.rel = "stylesheet";
    leafletCssLink.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    this.shadowRoot.appendChild(leafletCssLink);

    // Load JavaScript
    await this.loadScript("https://unpkg.com/leaflet/dist/leaflet.js");
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      this.shadowRoot.appendChild(script);
    });
  }

  populateElements(data, css, pattern) {
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

    if (data.coordinates) {
      console.log(pattern, data.coordinates)
      const latitudeCoords = data.coordinates[0]
      const longitudeCoords = data.coordinates[1]

      const div = document.createElement("div")
      div.classList.add("custom-id")

      const icon = document.createElement("ion-icon");
      icon.setAttribute("name", "location-outline");
      icon.classList.add("icon");

      const registoInstance = new Registo("geoCoordinates", "", `Localização Absoluta: ${latitudeCoords}, ${longitudeCoords}`, "custom-type");

      div.appendChild(icon);
      div.appendChild(registoInstance);

      geo_coordinates.appendChild(div)


    }
  }


  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

customElements.define("coordinates-component", GeoCoordinates);