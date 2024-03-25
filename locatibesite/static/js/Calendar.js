import Titulo from "./lib/titulo.js";
import Registo from "./lib/registo.js";
import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Calendar extends HTMLElement {
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
            const calendar_data = this.shadowRoot.getElementById("calendar_data");
            calendar_data.innerHTML = ""

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
            <div id="calendar_data" class="text-left"></div>
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

        const calendar_data = shadowRoot.getElementById("calendar_data");

        // Access the nested structure using the parts
        let keysToSearchList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "startDate", "endDate", "appliesOn", "exceptionType"];
        const resultList = getPathFromPointers(data, pointers, keysToSearchList);

        if (resultList.length > 0) {
            const registoInstance = new Titulo("Inventory", "", "Calendar Informations", ["custom-sub-title", "no-mb"]);
            calendar_data.appendChild(registoInstance);
        }

        for (const { path, lastKey } of resultList) {
            const n_rows = Object.keys(path).length

            const required_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            const data_keys = Object.keys(path)
            const daysOfWeek = required_days.every(day => data_keys.includes(day));

            let availability = false;
            for (const key of required_days) {
                if (!keysToSearchList.includes(key)) {
                    availability = false;
                } else { availability = true; }
            }

            if (daysOfWeek && availability) {
                let count = 0;
                let dayString = "";

                for (const day of required_days) {
                    if (path[day] == true) {
                        count++;
                        if (count == 0) { dayString += day; } else { dayString += ", " + day; }
                    }
                }

                const div = document.createElement("div")
                div.classList.add("custom-id")

                const icon = document.createElement("ion-icon");
                icon.setAttribute("name", "clipboard-outline");
                icon.classList.add("icon");

                const registoInstance = new Registo("Calendar", "", `Available ${count} days per weeks. Including ${dayString}. `, ["custom-type", "m-4-tb"]);

                div.appendChild(icon);
                div.appendChild(registoInstance);

                calendar_data.appendChild(div)

                keysToSearchList = keysToSearchList.filter(item => !required_days.includes(item));
            }

            if (path.startDate || path.endDate) {
                const div = document.createElement("div")
                div.classList.add("custom-id")

                const icon = document.createElement("ion-icon");
                icon.setAttribute("name", "clipboard-outline");
                icon.classList.add("icon");

                let registoInstance = null
                if (path.startDate && keysToSearchList.includes("startDate") && path.endDate && keysToSearchList.includes("endDate")) {
                    registoInstance = new Registo("Calendar", "", `This calendar infomation applies between ${path.startDate} and ${path.endDate}`, ["custom-type", "m-4-tb"]);
                } else {
                    if (path.startDate && keysToSearchList.includes("startDate")) { registoInstance = new Registo("Calendar", "", `This calendar infomation applies after ${path.startDate}`, ["custom-type", "m-4-tb"]); }
                    if (path.endDate && keysToSearchList.includes("endDate")) { registoInstance = new Registo("Calendar", "", `This calendar infomation applies before ${path.endDate}`, ["custom-type", "m-4-tb"]); }
                }
                div.appendChild(icon);
                div.appendChild(registoInstance);

                calendar_data.appendChild(div)

                keysToSearchList = keysToSearchList.filter(item => item !== "startDate");
                keysToSearchList = keysToSearchList.filter(item => item !== "endDate");
            }

            if (path.appliesOn && keysToSearchList.includes("appliesOn") && path.exceptionType && keysToSearchList.includes("exceptionType")) {
                const div = document.createElement("div")
                div.classList.add("custom-id")

                const icon = document.createElement("ion-icon");
                icon.setAttribute("name", "clipboard-outline");
                icon.classList.add("icon");

                const registoInstance = new Registo("Calendar", "", `An Exception happens on ${path.appliesOn} due to Exception Type: ${path.exceptionType}`, ["custom-type", "m-4-tb"]);

                div.appendChild(icon);
                div.appendChild(registoInstance);

                calendar_data.appendChild(div)

                keysToSearchList = keysToSearchList.filter(item => item !== "appliesOn");
                keysToSearchList = keysToSearchList.filter(item => item !== "exceptionType");
            }
        }
    }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("calendar-component", Calendar);