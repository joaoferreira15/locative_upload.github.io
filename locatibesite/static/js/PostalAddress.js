import { fetchData, getPathFromPointers, updateValue } from "./lib/functions.js"

class PostalAddress extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    // Variavel que aponta para os ficheiros css e json
    const css = this.getAttribute("css");
    const json = this.getAttribute("json");
    const pointers_string = this.getAttribute("pointers");
    const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

    // Fetch data from JSON and populate the elements
    fetchData(json)
      .then(data => this.populateElements(data, css, pointers))
      .catch(error => this.handleError(error));
  }



  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
    if (oldValue !== newValue && oldValue !== null) {
      const postal_address = this.shadowRoot.getElementById("postal_address");
      postal_address.innerHTML=""

      updateValue(this, name, newValue);
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="container" class="container custom-container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="postal_address"  class="text-left"></div>
        </div>
      `;
    return template;
  }



  populateElements(data, css, pointers) {
    const shadowRoot = this.shadowRoot;
    shadowRoot.getElementById("css").setAttribute("href", css);

    const postal_address = shadowRoot.getElementById("postal_address");
    let variables = []

    // Access the nested structure using the parts
    let keysToSearchList = ["address", "freguesia", "streetAddress", "addressLocality", "postalCode", "addressRegion", "addressCountry"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {

      if (path.address && keysToSearchList.includes("address")) {
        variables.push(`${path.address}, `)
        keysToSearchList = keysToSearchList.filter(item => item !== "address");
      }

      if (path.freguesia && keysToSearchList.includes("freguesia")) {
        variables.push(`${path.freguesia}, `)
        keysToSearchList = keysToSearchList.filter(item => item !== "freguesia");
      }

      if (path.streetAddress && keysToSearchList.includes("streetAddress")) {
        variables.push(`${path.streetAddress}, `)
        keysToSearchList = keysToSearchList.filter(item => item !== "streetAddress");
      }

      if (path.addressLocality && keysToSearchList.includes("addressLocality")) {
        variables.push(`${path.addressLocality}, `)
        keysToSearchList = keysToSearchList.filter(item => item !== "addressLocality");
      }

      if (path.postalCode && keysToSearchList.includes("postalCode")) {
        variables.push(`${path.postalCode} `)
        keysToSearchList = keysToSearchList.filter(item => item !== "postalCode");
      }

      if (path.addressRegion && keysToSearchList.includes("addressRegion")) {
        variables.push(`${path.addressRegion} `)
        keysToSearchList = keysToSearchList.filter(item => item !== "addressRegion");
      }

      if (path.addressCountry && keysToSearchList.includes("addressCountry")) {
        variables.push(` - ${path.addressCountry}`)
        keysToSearchList = keysToSearchList.filter(item => item !== "addressCountry");
      }
    }

    let string = ""
    for (const variable of variables) {
      string += String(variable)
    }

    const div = document.createElement("div")
    div.classList.add("custom-id")

    const icon = document.createElement("ion-icon");
    icon.setAttribute("name", "location-outline");
    icon.classList.add("icon");

    const row = document.createElement("p");
    row.id = `postalAddress2`
    row.textContent = `Morada: ${string}`;

    div.appendChild(icon);
    div.appendChild(row);

    postal_address.appendChild(div)
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("postal-address-component", PostalAddress);