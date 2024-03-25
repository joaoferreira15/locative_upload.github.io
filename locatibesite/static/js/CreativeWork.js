import createTableTitulo from "./lib/table_titulo.js";
import createTableRegisto from "./lib/table_registo.js";
import Registo from "./lib/registo.js";
import Description from "./lib/description.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class CreativeWork extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    //variavel que aponta para os ficheiros css e json
    const css = this.getAttribute("css");
    const json = this.getAttribute("json");
    //const pattern = this.getAttribute("pattern")
    const pattern = "2"
    const pointers_string = this.getAttribute("pointers");
    const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

    // Fetch data from JSON and populate the elements
    if (isValidJsonString(json)) {
      try {
        const data = JSON.parse(json);
        this.populateElements(data, css, pointers);
      } catch (error) {
        this.handleError(error);
      }
    } else {
      fetchData(json)
        .then(data => this.populateElements(data, css, pointers, pattern))
        .catch(error => this.handleError(error));
    }
  }



  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern"];
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
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="header_data" class="text-left"></div>
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

    const header_data = shadowRoot.getElementById("header_data");
    const container = shadowRoot.getElementById("container");

    if (pattern == "1") {
      // Create a table element
      const table = document.createElement("table");
      table.id = "headerTable"
      table.classList.add("custom-table");

      // Create a table row for the menu section
      const registoInstance = createTableTitulo("RoteiroTemático", "Header", 2);
      table.appendChild(registoInstance);
      header_data.appendChild(table);
    }

    // Access the nested structure using the parts
    let keysToSearchList = ["identifier", "genre", "name", "description", "publisher", "datePublished", "fileFormat"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {

      if (pattern === "1") {
        const table = this.shadowRoot.getElementById("headerTable")

        if (path.identifier && keysToSearchList.includes("identifier")) {
          const registoInstance = createTableRegisto("Header", ["identifier", path.identifier], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "identifier");
        }

        if (path.genre && keysToSearchList.includes("genre")) {
          const registoInstance = createTableRegisto("Header", ["genre", path.genre], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "genre");
        }

        if (path.name && keysToSearchList.includes("name")) {
          const registoInstance = createTableRegisto("Header", ["name", path.name], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "name");
        }

        if (path.description && keysToSearchList.includes("description")) {
          const registoInstance = createTableRegisto("Header", ["description", path.description], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "description");
        }

        if (path.publisher && keysToSearchList.includes("publisher")) {
          const registoInstance = createTableRegisto("Header", ["publisher", path.publisher.name], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "publisher");
        }

        if (path.datePublished && keysToSearchList.includes("datePublished")) {
          const registoInstance = createTableRegisto("Header", ["datePublished", path.datePublished], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "datePublished");
        }

        if (path.fileFormat && keysToSearchList.includes("fileFormat")) {
          const registoInstance = createTableRegisto("Header", ["fileFormat", path.fileFormat], "td");
          table.appendChild(registoInstance)
          keysToSearchList = keysToSearchList.filter(item => item !== "fileFormat");
        }
        header_data.appendChild(table);
      }

      else if (pattern === "2") {

        if (path.name && keysToSearchList.includes("name")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "text-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Header", "", `Intitulado "${path.name}"`, "m-5-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "name");
        }

        if (path.identifier && keysToSearchList.includes("identifier")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "clipboard-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Header", "", `O Roteiro Locativo assume o identificador [${path.identifier}]`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "identifier");
        }

        if (path.description && keysToSearchList.includes("description")) {

          const div = document.createElement("div")
          div.classList.add("custom-description")

          const registoInstance = new Description("Caracterization", "", path.description, "");
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "description");
        }

        if (path.genre && keysToSearchList.includes("genre")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "information-circle-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Header", "", `Este Roteiro Locativo explora ${path.genre}`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "genre");
        }

        if (path.datePublished && keysToSearchList.includes("datePublished")) {
          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "calendar-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Specific", "", `Criado em ${path.datePublished}`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "datePublished");
        }

        if (path.fileFormat && keysToSearchList.includes("fileFormat")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "document-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Specific", "", `Extraído de um ficheiro .${path.fileFormat}`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "fileFormat");
        }
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("creative-work-component", CreativeWork);