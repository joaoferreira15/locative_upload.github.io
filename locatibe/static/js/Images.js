import "./gallery.js"
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Images extends HTMLElement {
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
    //const pointers = [{ path: "No Path" }];

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
      const images = this.shadowRoot.getElementById("images");
      images.innerHTML = ""

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="images"></div>
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

    const container = shadowRoot.getElementById("container");
    const images = shadowRoot.getElementById("images");

    // Access the nested structure using the parts
    let keysToSearchList = ["images"];

    const resultList = getPathFromPointers(data, pointers, keysToSearchList);
    //console.log("resultList", resultList)

    for (const { path, lastKey } of resultList) {
      const n_rows = Object.keys(path).length
      //console.log(path)
      //console.log(lastKey)

      let pathImages = ""
      if (lastKey == "images" && !path.images) { pathImages = path } else if (path.images) { pathImages = path.images }
      //console.log(pathImages)

      for (let i = 0; i < pathImages.length; i++) {
        const div = document.createElement("div")
        const image_item = pathImages[i];;
        const galleryItem = document.createElement("img")

        if (image_item.url) {
          galleryItem.src = image_item.url
        }

        if (image_item.caption) {
          galleryItem.alt = image_item.caption
        }
        div.appendChild(galleryItem)
        images.appendChild(div)
      }
    }
    keysToSearchList = keysToSearchList.filter(item => item !== "images");
    console.log(images)

    const galleryComponent = document.createElement('gallery-component');
    galleryComponent.setAttribute('id', 'images');
    galleryComponent.setAttribute('dots', '2');
    galleryComponent.setAttribute('caption', 'true');
    galleryComponent.setAttribute('orientation', 'horizontal');

    while (images.firstChild) {
      galleryComponent.appendChild(images.firstChild);
    }

    images.remove()
    container.appendChild(galleryComponent)
  }


  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("images-component", Images);