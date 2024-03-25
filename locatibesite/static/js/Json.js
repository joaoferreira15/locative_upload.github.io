import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Json extends HTMLElement {
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
            const json_data = this.shadowRoot.getElementById("json_data");
            json_data.innerHTML = ""

            updateValue(this, name, newValue);
            //console.log("updated component")
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <div class="container">
          <style id="styleDiv"></style>
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="aresentacao" class="all_centredR">
            <div id="json_data" class="jsonDiv"></div>
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

        const json_data = shadowRoot.getElementById("json_data")

        let resultList = getPathFromPointers(data, pointers, null);
        //console.log("resultList", resultList)

        for (const { path, lastKey } of resultList) {

            if (path) {
                const jsonString = JSON.stringify(path, null, 2); // 2 spaces for indentation

                const pre = document.createElement('pre');
                pre.textContent = jsonString;
                pre.setAttribute("style", "font-size: 12px");

                json_data.appendChild(pre);
            }
        }
    }

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("json-component", Json);