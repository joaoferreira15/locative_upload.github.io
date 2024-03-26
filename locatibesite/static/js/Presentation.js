import Titulo from "./lib/titulo.js";
import Description from "./lib/description.js";
import Imagem from "./lib/imagem.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Presentation extends HTMLElement {
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
            const presentation_data = this.shadowRoot.getElementById("presentation_data");
            presentation_data.innerHTML = ""

            updateValue(this, name, newValue);
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div id="container" class="container custom-container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">   
          <div id="presentation_data" class="container-fluid page-header padding-small text-center"></div>
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

        const presentation_data = shadowRoot.getElementById("presentation_data");

        // Access the nested structure using the parts
        let keysToSearchList = ["title", "description", "thumbnail"];
        const resultList = getPathFromPointers(data, pointers, keysToSearchList);

        for (const { path, lastKey } of resultList) {
            const n_rows = Object.keys(path).length

            if (path.thumbnail && keysToSearchList.includes("thumbnail")) {
                const div = document.createElement("div")
                div.classList.add("recurso-image", "padding-small", "no-padding-top")
                div.setAttribute("id", "image-div")

                const registoInstance = new Imagem("Caracterization", "custom-image", path.thumbnail);
                div.appendChild(registoInstance)

                presentation_data.appendChild(div)

                keysToSearchList = keysToSearchList.filter(item => item !== "thumbnail");
            }

            if (path.title || path.description) {
                const div = document.createElement("div")
                div.classList.add("text-center", "m-30-tb")

                if (path.title && keysToSearchList.includes("title")) {
                    const registoInstance = new Titulo("Presentation", "", path.title, ["custom-big-title", "w-80",]);

                    div.appendChild(registoInstance)
                    presentation_data.appendChild(div)

                    keysToSearchList = keysToSearchList.filter(item => item !== "title");
                }

                if (path.description && keysToSearchList.includes("description")) {
                    const registoInstance = new Description("Presentation", "", path.description, ["w-90", "mt-15"]);

                    div.appendChild(registoInstance)
                    presentation_data.appendChild(div)

                    keysToSearchList = keysToSearchList.filter(item => item !== "description");
                }
            }
        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("presentation-component", Presentation);