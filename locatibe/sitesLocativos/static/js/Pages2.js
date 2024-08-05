import Description from "./lib/description.js";
import Imagem from "./lib/imagem.js";
import Titulo from "./lib/titulo.js";
import Link from "./lib/link.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

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
    //const pointers = [{ "path": 'No Path' }];

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
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao" class="recurso-square"></div>
        </div>
      `;
    return template;
  }



  populateElements(data, css, pointers, produto, map) {
    const shadowRoot = this.shadowRoot;

    if (css.startsWith("static") || css.startsWith("https")) {
      shadowRoot.getElementById("styleDiv").innerHTML = "";
      shadowRoot.getElementById("css").setAttribute("href", css);
    } else {
      shadowRoot.getElementById("css").setAttribute("href", "");
      shadowRoot.getElementById("styleDiv").innerHTML = css;
    }

    const apresentacao = shadowRoot.getElementById("apresentacao")

    // Access the nested structure using the parts
    let keysToSearchList = ["thumbnail", "title", "id", "description", "url", "geo"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);
    //console.log("resultList", resultList)
    for (const { path, lastKey } of resultList) {
      const n_rows = Object.keys(path).length
      //console.log("path", path)

      if (path.thumbnail && keysToSearchList.includes("thumbnail")) {
        const imagem = document.createElement("div")
        imagem.setAttribute("id", "imagem")
        imagem.classList.add("image-holder")


        const registoInstance = new Imagem("Pages", "resource-image", path.thumbnail);
        imagem.appendChild(registoInstance)
        apresentacao.appendChild(imagem)

        keysToSearchList = keysToSearchList.filter(item => item !== "thumbnail");
      }

      if (path.title || path.geo || path.description) {
        const descricao = document.createElement("div")
        descricao.setAttribute("id", "descricao")
        descricao.classList.add("recurso-text")

        if (path.title && keysToSearchList.includes("title")) {
          if (path.url && keysToSearchList.includes("url")) {
            const registoInstance = new Link("Pages", "", path.title, path.url, ["custom-title-pages"]);
            descricao.appendChild(registoInstance)

            keysToSearchList = keysToSearchList.filter(item => item !== "url");
          } else {
            const registoInstance = new Titulo("Pages", "", path.title, ["custom-title-pages"]);
            descricao.appendChild(registoInstance)
          }

          keysToSearchList = keysToSearchList.filter(item => item !== "title");
        }

        //if (path.id && keysToSearchList.includes("id")) {
        //  const registoInstance = new Registo("Pages", "ID", path.id, ["custom-type", "no-mt"]);
        //  descricao.appendChild(registoInstance)

        //  keysToSearchList = keysToSearchList.filter(item => item !== "id");
        //}

        if (path.geo) {
          if (keysToSearchList.includes("geo")) {
            const registoInstance = new Description("Pages", "", `Localizado em: ${path.geo.latitude}, ${path.geo.latitude}`, ["custom-description-pages"]);
            descricao.appendChild(registoInstance);
            //console.log("geo", path.id)
            keysToSearchList = keysToSearchList.filter(item => item !== "geo");
          }
        } else if (path.description && keysToSearchList.includes("description")) {
          const registoInstance = new Description("Pages", "", path.description, "custom-description-pages");
          descricao.appendChild(registoInstance);
          //console.log("description", path.id)
          keysToSearchList = keysToSearchList.filter(item => item !== "description");
        }

        //if (path.url && keysToSearchList.includes("url")) {
        //  const seeRecursoButton = document.createElement('a');
        //  if (path.url.startsWith("https")) {
        //    seeRecursoButton.href = path.url;
        //  } else { seeRecursoButton.href = `${path.url}.html`; }
        //  seeRecursoButton.classList.add('btn', 'btn-medium', 'btn-black');
        //  seeRecursoButton.target = "_blank"
        //  seeRecursoButton.textContent = 'See Recurso';

        //  navigationButton.appendChild(seeRecursoButton);
        //}

        //if (produto && map) {
        //  const showMapButton = document.createElement('a');
        //  showMapButton.id = `button-${produto}-${map}`;
        //  showMapButton.classList.add('btn', 'btn-medium', 'btn-black');
        //  showMapButton.textContent = 'Show Map';
        //  showMapButton.onclick = function () {
        //    navigateToMarker(produto, map);
        //  }

        //  navigationButton.appendChild(showMapButton);
        //}
        apresentacao.appendChild(descricao)
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("pages-component", Pages);