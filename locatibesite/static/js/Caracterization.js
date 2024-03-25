import Titulo from "./lib/titulo.js";
import Imagem from './lib/imagem.js';
import Registo from "./lib/registo.js";
import Description from "./lib/description.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Caracterization extends HTMLElement {
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
      const imagem = this.shadowRoot.getElementById("imagem");
      const caracterization_data = this.shadowRoot.getElementById("caracterization_data");
      imagem.innerHTML = ""
      caracterization_data.innerHTML = ""

      updateValue(this, name, newValue);
      console.log("updated component")
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao" class="text-left">      
            <div id="imagem"></div>
            <div id="caracterization_data" class="text-left"></div>
          </div>
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

    const caracterization_data = shadowRoot.getElementById("caracterization_data")
    const imagem = shadowRoot.getElementById("imagem");

    // Access the nested structure using the parts
    let keysToSearchList = ["name", "id", "description", "material", "photo.url", "price", "priceCurrency"];
    let resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {
      const n_rows = Object.keys(path).length

      let names = ["name", "tripHeadSign", "longName"]
      let namePath = ""
      let nameValue = ""
      for (const name of names) {
        switch (name) {
          case "name":
            if (path.name) { namePath = path.name; nameValue = path.name }
            break;
          case "tripHeadSign":
            if (path.tripHeadSign) { namePath = path.tripHeadSign; nameValue = path.tripHeadSign }
            break;
          case "longName":
            if (path.longName) { namePath = path.longName; if (path.shortName) { nameValue = `${path.shortName} | ${path.longName}` } }
            break;
        }
      }

      if (namePath && keysToSearchList.includes("name")) {
        if (n_rows <= 2 && !path.image) {
          const div = document.createElement("div")
          div.classList.add("custom-id")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "person-outline");
          icon.classList.add("icon");

          const registoInstance = new Registo("Caracterization", lastKey, nameValue, "");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          caracterization_data.appendChild(div)
        } else {
          if (path.type) {
            const registoInstance2 = new Registo("Caracterization", "", path.type, ["custom-type", "no-mt"]);

            const registoInstance = new Titulo("Caracterization", "", nameValue, ["custom-title", "no-mb"]);

            caracterization_data.appendChild(registoInstance)
            caracterization_data.appendChild(registoInstance2)
          } else {
            const registoInstance = new Titulo("Caracterization", "", nameValue, "custom-title");

            caracterization_data.appendChild(registoInstance)
          }
        }
        keysToSearchList = keysToSearchList.filter(item => item !== "name");
      }

      //if (path.identifier){
      if (path.id && keysToSearchList.includes("id")) {
        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "clipboard-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Caracterization", "Identifier", path.id, "number");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        caracterization_data.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "id");
      }

      if (path.description && keysToSearchList.includes("description")) {
        const div = document.createElement("div")
        div.classList.add("custom-description")

        const registoInstance = new Description("Caracterization", "", path.description, "custom-description");
        div.appendChild(registoInstance);

        caracterization_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }

      if (path.material && keysToSearchList.includes("material")) {
        const div = document.createElement("div")
        div.classList.add("custom-id")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "construct-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Specific", "", `Construído com "${path.material}"`, "");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        caracterization_data.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "material");
      }

      if (path.price) {
        const div = document.createElement("div")
        div.classList.add("custom-id")
        let string = ""
        if (path.priceCurrency) {
          string = `Custo: ${path.price} ${path.priceCurrency}`
          keysToSearchList = keysToSearchList.filter(item => item !== "priceCurrency");
        } else if (!path.priceCurrency) { string = `Custo: ${path.price} EUR` }

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "construct-outline");
        icon.classList.add("icon");

        const registoInstance = new Registo("Specific", "", string, "");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        caracterization_data.appendChild(div)
        keysToSearchList = keysToSearchList.filter(item => item !== "price");
      }

      if (path.photo && path.photo.url && keysToSearchList.includes("photo.url")) {
        const registoInstance = new Imagem("Caracterization", "custom-image", path.photo.url);
        imagem.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "photo.url");
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("caracterization-component", Caracterization);