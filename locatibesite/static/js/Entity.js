import Registo from "./lib/registo.js";
import Titulo from "./lib/titulo.js";
import Description from "./lib/description.js";
import Imagem from "./lib/imagem.js";
import { fetchData, getPathFromPointers, updateValue } from "./lib/functions.js"

class Entity extends HTMLElement {
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
    if (json.startsWith("{") && json.endsWith("}")) {
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
      const papel = this.shadowRoot.getElementById("papel");
      const imagem = this.shadowRoot.getElementById("imagem");
      const entity_data = this.shadowRoot.getElementById("entity_data");
      papel.innerHTML = ""
      imagem.innerHTML = ""
      entity_data.innerHTML = ""

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao" class="border">      
              <div id="papel" class="border-bottom mb-10"></div> 
              <div id="imagem"></div>
              <div id="entity_data"></div>
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

    const entity_data = shadowRoot.getElementById("entity_data");
    const imagem = shadowRoot.getElementById("imagem");
    const container = shadowRoot.getElementById("containerBorder");
    const papel = shadowRoot.getElementById("papel");

    // Access the nested structure using the parts
    let keysToSearchList = ["logo.url", "name", "identifier", "telephone", "email", "birthDate", "deathDate", "description", "inLanguage", "timeZone"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {
      const n_rows = Object.keys(path).length

      if (path.name && keysToSearchList.includes("name")) {

        const registoInstance = new Titulo("Entity", "", lastKey, ["custom-title", "no-mt", "no-mb"]);
        const registoInstance2 = new Titulo("Entity", "", path.name, ["custom-title", "m-4-tb", "no-mt", "no-mb"]);

        papel.appendChild(registoInstance)

        if (path.identifier && keysToSearchList.includes("identifier")) {

          const registoInstance2 = new Titulo("Entity", "", path.name, ["custom-title", "no-mt", "no-mb"]);
          const registoInstance3 = new Registo("Entity", "", path.identifier, ["custom-type", "no-mt"]);

          entity_data.appendChild(registoInstance2)
          entity_data.appendChild(registoInstance3)

          keysToSearchList = keysToSearchList.filter(item => item !== "identifier");

        } else {

          entity_data.appendChild(registoInstance2)

        }
        keysToSearchList = keysToSearchList.filter(item => item !== "name");
      }

      if (path.telephone && keysToSearchList.includes("telephone")) {
        const registoInstance = new Registo("Entity", "telephone", path.telephone, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "telephone");
      }

      if (path.email && keysToSearchList.includes("email")) {
        const registoInstance = new Registo("Entity", "email", path.email, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "email");
      }

      if (path.birthDate && keysToSearchList.includes("birthDate")) {
        const registoInstance = new Registo("Entity", "", `Data de Nascimento: ${path.birthDate}`, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "birthDate");
      }

      if (path.deathDate && keysToSearchList.includes("deathDate")) {
        const registoInstance = new Registo("Person", "", `Data de Falecimento: ${path.deathDate}`, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "deathDate");
      }

      if (path.inLanguage && keysToSearchList.includes("inLanguage")) {
        const registoInstance = new Registo("Entity", "inLanguage", path.inLanguage, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "inLanguage");
      }

      if (path.timeZone && keysToSearchList.includes("timeZone")) {
        const registoInstance = new Registo("Entity", "timeZone", path.timeZone, "centrado");
        entity_data.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "timeZone");
      }

      if (path.description && keysToSearchList.includes("description")) {
        const div = document.createElement("div")
        div.classList.add("custom-description-top")

        const registoInstance = new Description("Entity", "", path.description, "");
        div.appendChild(registoInstance);

        entity_data.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }

      if (!path.logo || !path.logo.url && keysToSearchList.includes("logo.url")) {
        const div = document.createElement("div")
        div.classList.add("apresentacao3")

        const registoInstance = new Imagem("Entity", "custom-logo", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");

        div.appendChild(registoInstance)
        imagem.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "logo.url");
      } else if (path.logo || path.logo.url && keysToSearchList.includes("logo.url")) {
        const div = document.createElement("div")
        div.classList.add("apresentacao3")

        const registoInstance = new Imagem("Entity", "custom-logo", path.logo.url);

        div.appendChild(registoInstance)
        imagem.appendChild(div)

        keysToSearchList = keysToSearchList.filter(item => item !== "logo.url");
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("entity-component", Entity);