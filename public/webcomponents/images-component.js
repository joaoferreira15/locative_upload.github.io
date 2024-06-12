import "./lib/gallery.js"
import Titulo from "./lib/titulo.js"
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Images extends HTMLElement {
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
  }

  connectedCallback() {
    if (isValidJsonString(this.json)) {
      try {
        const data = JSON.parse(this.json);
        this.populateElements(data, this.css, null);
      } catch (error) {
        this.handleError(error);
      }
    } else {
      fetchData(this.json)
        .then(data => {
          this.populateElements(data, this.css, this.pointers);
        })
        .catch(error => {
          this.handleError(error);
        });
    }
  }

  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ["css", "article_data", "json", "pointers"];
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
          <div id="apresentacao" class="text-left border-black">
            <div id="articleId" class="border-black-bottom"></div>
            <div id="images"></div>
          </div>
        </div>
      `;
    return template;
  }

  findKeyInJSON(data, targetKey) {
    if (typeof data === 'object') {
      if (targetKey in data) {
        return data[targetKey];
      }
      for (const key in data) {
        if (typeof data[key] === 'object') {
          const result = this.findKeyInJSON(data[key], targetKey);
          if (result !== undefined) {
            return result;
          }
        }
      }
    }
    return data;
  }
  
  populateElements(data, css, pointers) {
    if (css.startsWith("static") || css.startsWith("https")) {
      this.shadowRoot.getElementById("styleDiv").innerHTML = "";
      this.shadowRoot.getElementById("css").setAttribute("href", css);
    } else {
      this.shadowRoot.getElementById("css").setAttribute("href", "");
      this.shadowRoot.getElementById("styleDiv").innerHTML = css;
    }

    if (pointers) {
      let keysToSearchList = ["title", "images"];
      const resultList = getPathFromPointers(data, pointers, keysToSearchList);
      for (const { path, lastKey } of resultList) {
        const filteredKeys = this.createTitle(path, pointers, keysToSearchList)
        this.fillElements(path)
        keysToSearchList = filteredKeys
      }
      this.createGallery()
    } else {
      this.createTitle(data, null, null)
      data = this.findKeyInJSON(data, "images")
      this.fillElements(data)
      this.createGallery()
    }
  }

  createTitle(data, pointers, keysToSearchList) {
    const articleId = this.shadowRoot.getElementById("articleId");
    
    if (data.article_title && (!keysToSearchList || keysToSearchList.includes("title"))) {
      const registoInstance = new Titulo("Fotos", "", data.article_title, "");
      registoInstance.classList.add("centerd-text")
      articleId.appendChild(registoInstance);

      if (pointers) keysToSearchList = keysToSearchList.filter(item => item !== "title");
    }

    return keysToSearchList
  }

  createGallery() {
    const images = this.shadowRoot.getElementById("images");
    const apresentacao = this.shadowRoot.getElementById("apresentacao");

    const galleryComponent = document.createElement('gallery-component');
    galleryComponent.setAttribute('id', 'images');
    galleryComponent.setAttribute('dots', '2');
    galleryComponent.setAttribute('caption', 'true');
    galleryComponent.setAttribute('orientation', 'horizontal');

    while (images.firstChild) {
      galleryComponent.appendChild(images.firstChild);
    }

    images.remove()
    apresentacao.appendChild(galleryComponent)
  }


  fillElements(data) {
    const images = this.shadowRoot.getElementById("images");

    if (data instanceof Array) {
      for (let i = 0; i < data.length; i++) {
        const image_item = data[i]
        const div = document.createElement("div")
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
    } else if (data instanceof Object) {
      const image_item = data[i]
      const div = document.createElement("div")
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

  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

customElements.define("images-component", Images);