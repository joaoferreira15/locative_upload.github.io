import "./lib/description.js";
import "./lib/imagem.js";
import "./lib/titulo.js";
import "./lib/link.js";
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
        .then(data => {
          this.populateElements(data, css, pointers);
        })
        .catch(error => this.handleError(error));
    }
  }

  connectedCallback() {
    this.updateElements();
  }

  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern"];
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


  fetchAndDisplayUrl(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(text => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          resolve(doc);
        })
        .catch(error => {
          console.error('Fetch error: ', error);
          reject(error);
        });
    });
  }

  displayDomElements(doc) {
    const elements = doc.body.children;
    const fragment = document.createDocumentFragment();

    Array.from(elements).forEach(element => {
      fragment.appendChild(element.cloneNode(true));
    });

    return fragment
  }

  findElementBySelector(element, selector) {
    // Check if the current element matches the selector
    const result = element.querySelector(selector);
    if (result) {
      return result;
    }

    // Check for shadow roots
    if (element.shadowRoot) {
      // If shadow root exists, recursively search inside it
      const shadowResult = this.findElementBySelector(element.shadowRoot, selector);
      if (shadowResult) {
        return shadowResult;
      }
    }

    // Iterate over each child element
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      // Recursively search inside the child element
      const result = this.findElementBySelector(child, selector);
      if (result) {
        return result;
      }
    }

    // If the element is not found in this subtree, return null
    return null;
  }

  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="recurso-square-col hidden">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao" class="recurso-square"></div>
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

    let keysToSearchList = ["url", "type", "title"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    const fetchPromises = resultList.map(({ path, lastKey }) => {
      if (path.url) {
        return this.fetchAndDisplayUrl(path.url)
          .then(newPageContent => {
            const pageContent = newPageContent.querySelector("#page-highlight-section");
            const cloneContent = pageContent.cloneNode(true);
            const newDiv = document.createElement("div");
            newDiv.id = "fetchedContent"
            newDiv.classList.add("hidden")
            newDiv.appendChild(cloneContent);
            shadowRoot.appendChild(newDiv);
          })
          .catch(error => {
            console.error('Error fetching and displaying URL:', error);
          });
      }
    });

    Promise.all(fetchPromises)
      .then(() => {
        this.updateElements();
      })
      .catch(error => {
        console.error('Error fetching and displaying URLs:', error);
      });
  }



  updateElements() {
    const shadowRoot = this.shadowRoot;
    const apresentacao = shadowRoot.getElementById("apresentacao");

    var keysToSearchList = ["#imagem-component", "titulo-component", "description-component", "postal-address-component", "geo-coordinates-component"];

    const pageContent = shadowRoot.children[1].firstChild;
    console.log("pageContent", shadowRoot.children[1]);

    const descricao = document.createElement("div")
    descricao.setAttribute("id", "descricao")
    descricao.classList.add("recurso-text")

    keysToSearchList.forEach(key => {
      const component = this.findElementBySelector(pageContent, key);
      //console.log("component", component);

      if (component) {
        if (key == "imagem-component" && keysToSearchList.includes("imagem-component")) {
          apresentacao.appendChild(component)
          keysToSearchList = keysToSearchList.filter(item => item !== "imagem-component");
        }

        else if (key == "titulo-component" && keysToSearchList.includes("titulo-component")) {
          descricao.appendChild(component)
          keysToSearchList = keysToSearchList.filter(item => item !== "titulo-component");
        }

        else if (key == "postal-address-component" && keysToSearchList.includes("postal-address-component")) {
          descricao.appendChild(component);
          keysToSearchList = keysToSearchList.filter(item => item != "postal-address-component" && item != "geo-coordinates-component");
        }

        else if (key == "geo-coordinates-component" && keysToSearchList.includes("geo-coordinates-component")) {
          descricao.appendChild(component);
          keysToSearchList = keysToSearchList.filter(item => item != "postal-address-component" && item != "geo-coordinates-component");
        }

        else if (key == "description-component" && keysToSearchList.includes("description-component")) {
          descricao.appendChild(component);
          keysToSearchList = keysToSearchList.filter(item => item !== "description-component");
        }
      }
    });
    apresentacao.appendChild(descricao)
    shadowRoot.querySelector("#fetchedContent").remove()
  }

  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("pages-component", Pages);