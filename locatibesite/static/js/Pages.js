import Registo from "./lib/registo.js";
import Description from "./lib/description.js";
import Imagem from "./lib/imagem.js";
import Titulo from "./lib/titulo.js";
import { fetchData, getPathFromPointers, updateValue } from "./lib/functions.js"

class Pages extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    //variavel que aponta para os ficheiros css e json
    const css = this.getAttribute("css");
    const json = this.getAttribute("json");
    const produto = this.getAttribute("produto");
    const map = this.getAttribute("map");
    const pointers_string = this.getAttribute("pointers");
    const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

    // Fetch data from JSON and populate the elements
    fetchData(json)
      .then(data => this.populateElements(data, css, pointers, produto, map))
      .catch(error => this.handleError(error));
  }



  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern", "produto", "map"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
    if (oldValue !== newValue && oldValue !== null) {
      const imagem = this.shadowRoot.getElementById("imagem");
      const descricao = this.shadowRoot.getElementById("descricao");
      const navigationButton = this.shadowRoot.getElementById("navigation-button");

      imagem.innerHTML = "";
      imagem.descricao = "";
      navigationButton.innerHTML = "";

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="recurso-square-col">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="aresentacao" class="recurso-square">
              <div id="imagem" class="image-holder"></div>
              <div id="descricao" class="recurso-text"></div>
          </div>
          <div id="navigation-button"></div>
        </div>
      `;
    return template;
  }



  populateElements(data, css, pointers, produto, map) {
    const shadowRoot = this.shadowRoot;
    shadowRoot.getElementById("css").setAttribute("href", css);

    const imagem = shadowRoot.getElementById("imagem");
    const descricao = shadowRoot.getElementById("descricao");
    const navigationButton = this.shadowRoot.getElementById("navigation-button");

    // Access the nested structure using the parts
    let keysToSearchList = ["thumbnail", "title", "id", "description", "url"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {
      const n_rows = Object.keys(path).length

      if (path.thumbnail && keysToSearchList.includes("thumbnail")) {

        const registoInstance = new Imagem("Pages", "resource-image", path.thumbnail);
        imagem.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "thumbnail");
      }

      if (path.title && keysToSearchList.includes("title")) {
        const registoInstance = new Titulo("Pages", "", `${path.title}`, ["no-mb"]);
        descricao.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "title");
      }

      if (path.id && keysToSearchList.includes("id")) {
        const registoInstance = new Registo("Pages", "", `ID: ${path.id}`, ["custom-type", "no-mt"]);
        descricao.appendChild(registoInstance)

        keysToSearchList = keysToSearchList.filter(item => item !== "id");
      }

      if (path.description && keysToSearchList.includes("description")) {
        const registoInstance = new Description("Pages", "", path.description, "smallDescription");
        descricao.appendChild(registoInstance);

        keysToSearchList = keysToSearchList.filter(item => item !== "description");
      }

      if (path.url && keysToSearchList.includes("url")) {
        const seeRecursoButton = document.createElement('a');
        if (path.url.startsWith("https")) {seeRecursoButton.href = path.url;
        } else {seeRecursoButton.href = `${path.url}.html`;}
        seeRecursoButton.classList.add('btn', 'btn-medium', 'btn-black');
        seeRecursoButton.target="_blank"
        seeRecursoButton.textContent = 'See Recurso';

        navigationButton.appendChild(seeRecursoButton);
      }

      if (produto && map) {
        const showMapButton = document.createElement('a');
        showMapButton.id = `button-${produto}-${map}`;
        showMapButton.classList.add('btn', 'btn-medium', 'btn-black');
        showMapButton.textContent = 'Show Map';
        showMapButton.onclick = function () {
          navigateToMarker(produto, map);
        }

        navigationButton.appendChild(showMapButton);
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("pages-component", Pages);