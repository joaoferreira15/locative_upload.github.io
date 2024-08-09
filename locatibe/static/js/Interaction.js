import Titulo from "./lib/titulo.js";
import Registo from "./lib/registo.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Interaction extends HTMLElement {
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
            const interaction_data = this.shadowRoot.getElementById("interaction_data");
            interaction_data.innerHTML = ""

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
            <div id="interaction_data" class="text-left"></div>
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

        const interaction_data = shadowRoot.getElementById("interaction_data");

        // Access the nested structure using the parts
        let keysToSearchList = ["arrivalTime", "departureTime"];
        const resultList = getPathFromPointers(data, pointers, keysToSearchList);

        for (const { path, lastKey } of resultList) {
            const n_rows = Object.keys(path).length

            if ((path.arrivalTime && keysToSearchList.includes("arrivalTime")) || (path.departureTime && keysToSearchList.includes("departureTime"))) {
                const div = document.createElement("div")
                div.classList.add("custom-id")

                const registoInstance = new Titulo("Caracterization", "", "Horários", ["custom-sub-title", "no-mb"])
                interaction_data.appendChild(registoInstance)

                if (path.arrivalTime && keysToSearchList.includes("arrivalTime")) {
                    const div = document.createElement("div")
                    div.classList.add("custom-id")

                    const icon = document.createElement("ion-icon");
                    icon.setAttribute("name", "clipboard-outline");
                    icon.classList.add("icon");

                    const registoInstance2 = new Registo("Caracterization", "arrivalTime", path.arrivalTime, ["custom-type", "m-4-tb"]);

                    div.appendChild(icon);
                    div.appendChild(registoInstance2);

                    interaction_data.appendChild(div)

                    keysToSearchList = keysToSearchList.filter(item => item !== "arrivalTime");
                }
                if (path.departureTime && keysToSearchList.includes("departureTime")) {
                    const div = document.createElement("div")
                    div.classList.add("custom-id")

                    const icon = document.createElement("ion-icon");
                    icon.setAttribute("name", "clipboard-outline");
                    icon.classList.add("icon");

                    const registoInstance3 = new Registo("Caracterization", "departureTime", path.departureTime, ["custom-type", "m-4-tb"]);

                    div.appendChild(icon);
                    div.appendChild(registoInstance3);

                    interaction_data.appendChild(div)

                    keysToSearchList = keysToSearchList.filter(item => item !== "departureTime");
                }
            }

        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("interaction-component", Interaction);