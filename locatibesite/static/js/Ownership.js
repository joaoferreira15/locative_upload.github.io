import Registo from "./lib/registo.js";
import { fetchData, getPathFromPointers, updateValue } from "./lib/functions.js"

class Ownership extends HTMLElement {
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
            const ownership_data = this.shadowRoot.getElementById("ownership_data");
            ownership_data.innerHTML = ""

            updateValue(this, name, newValue);
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao" class="text-left">      
            <div id="ownership_data" class="text-left"></div>
          </div>
        </div>
      `;
        return template;
    }



    populateElements(data, css, pointers) {
        const shadowRoot = this.shadowRoot;
        
        if (css.startsWith("static") || css.startsWith("https")){
            shadowRoot.getElementById("css").setAttribute("href", css);
        } else { shadowRoot.getElementById("styleDiv").innerHTML = css;}

        const ownership_data = shadowRoot.getElementById("ownership_data");

        // Access the nested structure using the parts
        let keysToSearchList = ["operatedBy", "ownedBy"];
        const resultList = getPathFromPointers(data, pointers, keysToSearchList);

        for (const key of keysToSearchList) {

            for (const { path, lastKey } of resultList) {
                const n_rows = Object.keys(path).length

                if (Object.keys(path).includes(key)) {
                    
                    const div = document.createElement("div")
                    div.classList.add("custom-id")

                    const icon = document.createElement("ion-icon");
                    icon.setAttribute("name", "clipboard-outline");
                    icon.classList.add("icon");

                    const registoInstance = new Registo("Caracterization", `${key}`, path[key], ["custom-type", "m-4-tb"]);

                    div.appendChild(icon);
                    div.appendChild(registoInstance);

                    ownership_data.appendChild(div)
                }
            }
        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("ownership-component", Ownership);