import createTableTitulo from "./lib/table_titulo.js";
import createTableRegisto from "./lib/table_registo.js";
import Registo from "./lib/registo.js";
import Titulo from "./lib/titulo.js";
import Description from "./lib/description.js";
import { updateValue, isValidJsonString, fetchData, getPathFromPointers } from "./lib/functions.js"

class CreativeWork extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });
    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    //variavel que aponta para os ficheiros css e json
    const generalCss = `p {
    font-family: "DM Sans", Verdana, sans-serif;
}

h2 {
    font-family: "Syne", Lato, sans-serif;
}

a {
    text-decoration: none;
    font-family: "Syne", Lato, sans-serif;
    color: inherit;
}

.resource, .locative-site, .data-provider {
            border: 1px solid #ccc;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }

        .resource {
            background-color: #f9f9f9;
        }

        .resource-header {
            margin-bottom: 10px;
        }
        .resource-header h1 {
            margin: 0;
            font-size: 1.5em;
        }
        .resource-description {
            margin: 20px 0;
        }
        .locative-site {
            background-color: #f9f9f9;
        }
        .data-provider {
            background-color: #f9f9f9;
            font-style: italic;
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
  margin: 15px;
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

.border-black {
  border: 1px solid black;
  }

.border-black-bottom {
  border-bottom: 1px solid black;
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

.centerd-text{
    text-align: center;
}

.ML-20 {
      margin: 20px;
}

#navigation-button {
  display: flex;
  justify-content: center;
  gap: 10px;
}`
    this.css = this.getAttribute("css") ? this.getAttribute("css") : generalCss
    this.json = this.getAttribute("article_data") ? this.getAttribute("article_data") : this.getAttribute("json");
    this.pointers = this.getAttribute("pointers") ? JSON.parse(this.getAttribute("pointers").replace(/'/g, '"')) : null
    this.pattern = this.getAttribute("pattern") || "3";
  }

  connectedCallback() {
    if (isValidJsonString(this.json)) {
      try {
        const data = JSON.parse(this.json);
        this.loadLibraries()
          .then(() => {
            this.populateElements(data, this.css, null, this.pattern);
          })
          .catch(error => {
            console.error("Failed to load libraries:", error);
          });
      } catch (error) {
        this.handleError(error);
      }
    } else {
      fetchData(this.json)
        .then(data => {
          return this.loadLibraries().then(() => data);
        })
        .then(data => {
          this.populateElements(data, this.css, this.pointers, this.pattern);
        })
        .catch(error => {
          this.handleError(error);
        });
    }
  }

  async loadLibraries() {
    // Load Ionicons CSS
    const ioniconsCssLink = document.createElement("link");
    ioniconsCssLink.rel = "stylesheet";
    ioniconsCssLink.href = "https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css";
    this.shadowRoot.appendChild(ioniconsCssLink);

    // Load Ionicons JS modules
    await this.loadScript("https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js", true);
  }

  loadScript(src, typeModule = false) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = typeModule ? "module" : "text/javascript";
      script.nomodule = !typeModule;
      script.onload = resolve;
      script.onerror = reject;
      this.shadowRoot.appendChild(script);
    });
  }

  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "article_data", "json", "pointers", "pattern"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
    if (oldValue !== newValue && oldValue !== null) {
      const header_data = this.shadowRoot.getElementById("header_data");
      header_data.innerHTML = ""

      updateValue(this, name, newValue);
    }
  }

  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container border-black">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="articleId" class="border-black-bottom"></div>
          <div id="header_data" class="text-left ML-20"></div>
        </div>
      `;
    return template;
  }

  populateElements(data, css, pointers, pattern) {

    if (css.startsWith("static") || css.startsWith("https")) {
      this.shadowRoot.getElementById("styleDiv").innerHTML = "";
      this.shadowRoot.getElementById("css").setAttribute("href", css);
    } else {
      this.shadowRoot.getElementById("css").setAttribute("href", "");
      this.shadowRoot.getElementById("styleDiv").innerHTML = css;
    }

    if (pointers) {
      var keysToSearchList = ["id", "type", "title", "provider", "site id", "site about"]
      // data number of key:values inside
      let resultList = getPathFromPointers(data, pointers, keysToSearchList);
      for (const { path, lastKey } of resultList) {
        const filteredKeys = this.fillElements(path, true, lastKey, keysToSearchList, pattern)
        keysToSearchList = filteredKeys
      }
    } else {
      this.fillElements(data, false, null, null, pattern)
    }
  }

  fillElements(data, pointers, lastKey, keysToSearchList, pattern) {
    const header_data = this.shadowRoot.getElementById("header_data");
    const articleId = this.shadowRoot.getElementById("articleId");

    if (pattern == "1") {
      // Create a table element
      var table = this.shadowRoot.getElementById("headerTable");

      if (!table) {
        const newTable = document.createElement("table");
        newTable.id = "headerTable";
        newTable.classList.add("custom-table");

        // Create a table row for the menu section
        const registoInstance = createTableTitulo("RoteiroTemático", "Header", 2);
        newTable.appendChild(registoInstance);

        // Append the new table to header_data
        header_data.appendChild(newTable);

        table = this.shadowRoot.getElementById("headerTable");
      }

      if (data.resource_id && (!keysToSearchList || keysToSearchList.includes("id"))) {
        const registoInstance = createTableRegisto("Header", ["identifier", data.resource_id], "td");
        table.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "id");
      }

      if (data.resource_type && (!keysToSearchList || keysToSearchList.includes("type"))) {
        const registoInstance = createTableRegisto("Header", ["type", data.resource_type], "td");
        table.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "type");
      }

      if (data.resource_title && (!keysToSearchList || keysToSearchList.includes("title"))) {
        const registoInstance = createTableRegisto("Header", ["title", data.resource_title], "td");
        table.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "title");
      }

      if (data.resource_description && (!keysToSearchList || keysToSearchList.includes("description"))) {
        const registoInstance = createTableRegisto("Header", ["description", data.resource_description], "td");
        table.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }

      if (path.data_provider && (!keysToSearchList || keysToSearchList.includes("provider"))) {
        const registoInstance = createTableRegisto("Header", ["data provider", path.data_provider], "td");
        table.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "provider");
      }
      header_data.appendChild(table);
    }

    else if (pattern == "2") {

      if (data.resource_id) {
        const registoInstance = new Titulo("StatueInfo", "", `Resource ${data.resource_id}`, "");
        registoInstance.classList.add("centerd-text")
        articleId.appendChild(registoInstance);
      }

      if (data.resource_title && (!keysToSearchList || keysToSearchList.includes("title"))) {

        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "information-circle-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Header", "", `Resource Title: ${data.resource_title}`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        header_data.appendChild(div)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "title");
      }

      if (data.resource_id && (!keysToSearchList || keysToSearchList.includes("id"))) {

        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "information-circle-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Header", "", `Resource Identifier: ${data.resource_id}`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        header_data.appendChild(div)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "id");
      }

      if (data.resource_type && (!keysToSearchList || keysToSearchList.includes("type"))) {

        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "information-circle-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Header", "", `Resource Type: ${data.resource_type}`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        header_data.appendChild(div)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "type");
      }

      if (data.data_provider && (!keysToSearchList || keysToSearchList.includes("provider"))) {
        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "information-circle-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Specific", "", `Data Provider: ${data.data_provider}`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        header_data.appendChild(div)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "provider");
      }

      if (data.resource_description && (!keysToSearchList || keysToSearchList.includes("description"))) {
        const registoInstance = new Description("Caracterization", "", data.resource_description, "custom-description");

        header_data.appendChild(registoInstance)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }
    }

    else if (pattern == "3") {

      if (data.resource_id) {
        const registoInstance = new Titulo("StatueInfo", "", `Resource ${data.resource_id}`, "");
        registoInstance.classList.add("centerd-text")
        articleId.appendChild(registoInstance);

        const div = document.createElement("div")
        div.classList.add("resource")
        const header = document.createElement("header")
        header.classList.add("resource-header")
        div.appendChild(header)
        header_data.appendChild(div)

      }

      if(data.locative_site_id) {
        const div = document.createElement("div")
        div.classList.add("locative-site")
        const header = document.createElement("header")
        header.classList.add("locative-site-header")
        div.appendChild(header)
        header_data.appendChild(div)
      }

      if (data.resource_title && (!keysToSearchList || keysToSearchList.includes("title"))) {
        const registoInstance = new Registo("Header", "Recurso", data.resource_title, "custom-title");
        this.shadowRoot.querySelector(".resource-header").appendChild(registoInstance)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "title");
      }

      if (data.resource_id && (!keysToSearchList || keysToSearchList.includes("id"))) {
        const registoInstance = new Registo("Header", "", `Resource Identifier: ${data.resource_id}`, "");
        this.shadowRoot.querySelector(".resource-header").appendChild(registoInstance)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "id");
      }

      if (data.resource_type && (!keysToSearchList || keysToSearchList.includes("type"))) {
        const registoInstance = new Registo("Header", "", `Resource Type: ${data.resource_type}`, "");
        this.shadowRoot.querySelector(".resource-header").appendChild(registoInstance)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "type");
      }

      if (data.resource_description && (!keysToSearchList || keysToSearchList.includes("description"))) {
        const div = document.createElement("div")
        div.classList.add("resource-description")

        const registoInstance = new Registo("Caracterization", "", data.resource_description, "");
        div.appendChild(registoInstance)

        this.shadowRoot.querySelector(".resource").appendChild(div)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }

      if (data.locative_site_id && (!keysToSearchList || keysToSearchList.includes("site id"))) {
        const registoInstance = new Titulo("Caracterization", "", "Site Locativo", "custom-titulo");
        this.shadowRoot.querySelector(".locative-site-header").appendChild(registoInstance)

        const registoInstance2 = new Registo("Caracterization", "", `Site Identifier: ${data.locative_site_id}`, "");
        this.shadowRoot.querySelector(".locative-site").appendChild(registoInstance2)

        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "site id");
      }

      if (data.locative_site_about && (!keysToSearchList || keysToSearchList.includes("site about"))) {
        const registoInstance2 = new Registo("Caracterization", "", data.locative_site_about, "");

        this.shadowRoot.querySelector(".locative-site").appendChild(registoInstance2)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "site about");
      }

      if (data.data_provider && (!keysToSearchList || keysToSearchList.includes("provider"))) {
        const footer = document.createElement("footer")
        footer.classList.add("data-provider")

        const registoInstance = new Registo("Specific", "Data Provide by", data.data_provider, "");
        footer.appendChild(registoInstance)

        header_data.appendChild(footer)
        if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "provider");
      }
    }

    return keysToSearchList
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("resource-info", CreativeWork);