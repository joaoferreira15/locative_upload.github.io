import Registo from "./lib/registo.js";
import Titulo from "./lib/titulo.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Inventory extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    //variavel que aponta para os ficheiros css e json
    const css = this.getAttribute("css");
    const json = this.getAttribute("json");
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
        .then(data => this.populateElements(data, css, pointers))
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
      const inventory_data = this.shadowRoot.getElementById("inventory_data");
      inventory_data.innerHTML = ""

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="inventory_data" class="text-left"></div>
        </div>
      `;
    return template;
  }



  populateElements(data, css, pointers) {
    const shadowRoot = this.shadowRoot;

    if (css.startsWith("static") || css.startsWith("https")) {
      shadowRoot.getElementById("styleDiv").innerHTML = "";
      shadowRoot.getElementById("css").setAttribute("href", css);
    } else {
      shadowRoot.getElementById("css").setAttribute("href", "");
      shadowRoot.getElementById("styleDiv").innerHTML = css;
    }

    const inventory_data = shadowRoot.getElementById("inventory_data")

    // Access the nested structure using the parts
    let keysToSearchList = ["inventoryNumber", "dateInInventory"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {

      if (path.inventoryNumber || path.dateInInventory) {
        const registoInstance = new Titulo("Inventory", "", "Informações sobre Inventário", ["custom-sub-title", "m-4-tb"]);
        inventory_data.appendChild(registoInstance);
      }

      if (path.inventoryNumber && keysToSearchList.includes("inventoryNumber")) {
        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "clipboard-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("inventory", "", `Inventory ID: "${path.inventoryNumber}"`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        inventory_data.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "inventoryNumber");
      }

      if (path.dateInInventory && keysToSearchList.includes("dateInInventory")) {
        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "calendar-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("inventory", "dateInInventory", `"${path.dateInInventory}"`, "m-4-tb");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        inventory_data.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "dateInInventory");
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("inventory-component", Inventory);