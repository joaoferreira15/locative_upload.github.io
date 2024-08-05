import Registo from "./lib/registo.js";
import Titulo from "./lib/titulo.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Specific extends HTMLElement {
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
      const specific_data = this.shadowRoot.getElementById("specific_data");
      specific_data.innerHTML = ""

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">     
          <div id="specific_data" class="text-left"></div>
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

    const specific_data = shadowRoot.getElementById("specific_data")

    // Access the nested structure using the parts
    let keysToSearchList = ["condition", "material", "dateCreated"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {
      if (path.condition || path.material || path.dateCreated || path.monumentType || path.price) {

        const registoInstance = new Titulo("Specific", "", "Outras Informações", ["custom-sub-title", "m-4-tb"]);
        specific_data.appendChild(registoInstance);

        if (path.condition && keysToSearchList.includes("condition")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "eye-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Specific", "", `Econtra-se num "${path.condition}" estado de condição`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          specific_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "condition");
        }

        if (path.material && keysToSearchList.includes("material")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "construct-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Specific", "", `Construído com ${path.material}`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          specific_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "material");
        }

        if (path.dateCreated && keysToSearchList.includes("dateCreated")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "calendar-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Specific", "", `Criado em ${path.dateCreated}`, "m-4-tb");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          specific_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "dateCreated");
        }

        if (path.price && keysToSearchList.includes("price")) {

          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "calendar-outline");
          icon.classList.add("icon");

          let registoInstance = null
          if (path.priceCurrency) {
            registoInstance = new Registo("Specific", "", `Preço: ${path.price} ${path.priceCurrency}`, "m-4-tb");
          } else { registoInstance = new Registo("Specific", "", `Preço: ${path.price} EUR`, "m-4-tb"); }

          div.appendChild(icon);
          div.appendChild(registoInstance);

          specific_data.appendChild(div)

          keysToSearchList = keysToSearchList.filter(item => item !== "price");
        }
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("specific-component", Specific);