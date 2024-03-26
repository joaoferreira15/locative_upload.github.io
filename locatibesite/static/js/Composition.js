import Titulo from "./lib/titulo.js";
import Registo from "./lib/registo.js";
import createTableRegistoLinha from "./lib/table_registo_linha.js";
import createTableTituloLinha from "./lib/table_titulo_linha.js";

import { fetchData, getPathFromPointers, extractSubstring, updateValue, isValidJsonString } from "./lib/functions.js"

class Composition extends HTMLElement {
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
      const composition_data = this.shadowRoot.getElementById("composition_data");
      composition_data.innerHTML = ""

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
            <div id="composition_data" class="text-left"></div>
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

    const composition_data = shadowRoot.getElementById("composition_data");

    // Access the nested structure using the parts
    let keysToSearchList = ["hasStop", "hasTrip", "hasService", "hasRoute", "hasFares", "hasStops", "hasTrips", "hasServices", "hasRoutes"];
    let valuesToCheck = ["hasStop", "hasTrip", "hasService", "hasRoute", "hasStops", "hasTrips", "hasServices", "hasRoutes"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const { path, lastKey } of resultList) {
      //console.log(Object.keys(path).includes("hasFares"))
      //console.log(valuesToCheck.some(key => Object.keys(path).includes(key)))
      if (Object.keys(path).includes("hasFares") && !valuesToCheck.some(key => Object.keys(path).includes(key))) { break; }
      else {
        const registoInstance = new Titulo("Inventory", "", "This entity is related to an: ", ["custom-sub-title", "no-mb"]);
        composition_data.appendChild(registoInstance);
      }
    }

    for (const key of keysToSearchList) {
      const keyNoPrefix = extractSubstring(key, "has")
      let isFirstIteration = true;
      //console.log(key)
      for (const { path, lastKey } of resultList) {
        const n_rows = Object.keys(path).length
        //console.log(path)
        //console.log(key)
        //console.log(path[key])

        if (Object.keys(path).includes(key) && key != "hasFares") {
          const value = path[key];
          //console.log(value)
          if (typeof value == "object") {
            if (Array.isArray(value)) {
              //console.log(value)
              const divCol = document.createElement("div")
              divCol.classList.add("custom-id-col")

              value.forEach(item => {
                const div = document.createElement("div")
                div.classList.add("custom-id")

                let names = ["name", "tripHeadSign", "longName"]
                let namePath = ""
                let nameValue = ""

                for (const name of names) {
                  switch (name) {
                    case "name":
                      if (item.name) { namePath = item.name; nameValue = item.name }
                      break;
                    case "tripHeadSign":
                      if (item.tripHeadSign) { namePath = item.tripHeadSign; nameValue = item.tripHeadSign }
                      break;
                    case "longName":
                      if (item.longName) { namePath = item.longName; if (item.shortName) { nameValue = `${item.shortName} | ${item.longName}` } }
                      break;
                  }
                }

                const icon = document.createElement("ion-icon");
                icon.setAttribute("name", "clipboard-outline");
                icon.classList.add("icon");

                const registoInstance = new Registo("Composition", `${keyNoPrefix} called`, nameValue, ["custom-type", "m-4-tb"]);

                div.appendChild(icon);
                div.appendChild(registoInstance);
                divCol.appendChild(div)
              })
              composition_data.appendChild(divCol)
            }
            else {
              //console.log(value)
              const divCol = document.createElement("div")
              divCol.classList.add("custom-id-col")

              const div = document.createElement("div")
              div.classList.add("custom-id")

              let names = ["name", "tripHeadSign", "longName"]
              let namePath = ""
              let nameValue = ""

              for (const name of names) {
                switch (name) {
                  case "name":
                    if (value.name) { namePath = value.name; nameValue = value.name }
                    break;
                  case "tripHeadSign":
                    if (value.tripHeadSign) { namePath = value.tripHeadSign; nameValue = value.tripHeadSign }
                    break;
                  case "longName":
                    if (value.longName) { namePath = value.longName; if (value.shortName) { nameValue = `${value.shortName} | ${value.longName}` } }
                    break;
                }
              }

              const icon = document.createElement("ion-icon");
              icon.setAttribute("name", "clipboard-outline");
              icon.classList.add("icon");

              const registoInstance = new Registo("Composition", `${keyNoPrefix} called`, nameValue, ["custom-type", "m-4-tb"]);

              div.appendChild(icon);
              div.appendChild(registoInstance);
              divCol.appendChild(div)

              composition_data.appendChild(divCol)
            }
          }

          else if (typeof value != "object") {
            const div = document.createElement("div")
            div.classList.add("custom-id")

            const icon = document.createElement("ion-icon");
            icon.setAttribute("name", "clipboard-outline");
            icon.classList.add("icon");

            const registoInstance = new Registo("Composition", `${keyNoPrefix}`, value, ["custom-type", "m-4-tb"]);

            div.appendChild(icon);
            div.appendChild(registoInstance);

            composition_data.appendChild(div)
          }
        }

        else if (Object.keys(path).includes(key) && key == "hasFares") {
          let farePath = path[key];
          //console.log(path[key])
          //console.log(path)
          //console.log(key)
          if (typeof farePath != "object") {
            const div = document.createElement("div")
            div.classList.add("custom-id")

            const icon = document.createElement("ion-icon");
            icon.setAttribute("name", "clipboard-outline");
            icon.classList.add("icon");

            const registoInstance = new Registo("Composition", `${keyNoPrefix}`, farePath, ["custom-type", "m-4-tb"]);

            div.appendChild(icon);
            div.appendChild(registoInstance);

            composition_data.appendChild(div)
          }

          if (typeof farePath == "object") {

            if (isFirstIteration) {
              const tableFares = document.createElement("table");
              tableFares.id = "FaresTable";
              tableFares.classList.add("custom-table")
              composition_data.appendChild(tableFares);
            }

            const tableFares = this.shadowRoot.getElementById("FaresTable");
            let values = []
            let values2 = [["route", "Route"]]
            let titles = []

            if (path.id) {
              if (path.longName) {
                values2.push(["route", `${path.id}-${path.longName}`, 2])
              } else { values2.push(["route", `${path.id}`, 2]) }
              const registoInstance = createTableTituloLinha("Schedule", values2, "th");
              tableFares.appendChild(registoInstance)
            } else {
              values2.push(["route", "---", 2])
              const registoInstance = createTableTituloLinha("Schedule", values2, "th");
              tableFares.appendChild(registoInstance)
            }

            if (Object.keys(farePath).length > 0) {
              titles = [["price", "Price"], ["stop", "Origin Stop"], ["stop", "Arrival Stop"]]
              const registoInstance = createTableTituloLinha("Schedule", titles, "th");
              tableFares.appendChild(registoInstance)
            }

            if (farePath) {
              farePath.forEach(item => {
                if (item.price) {
                  if (item.priceCurrency) {
                    values.push(["price", `${item.price} ${item.priceCurrency}`])
                  } else { values.push(["price", `${item.price} EUR`]) }
                } else { values.push(["price", "---"]) }

                if (item.price) {
                  let stops = item.hasStops
                  stops.forEach(stopItem => {

                    if (stopItem.id) {
                      if (stopItem.name) {
                        values.push(["identifier", `${stopItem.id}-${stopItem.name}`])
                      } else { values.push(["identifier", `${stopItem.id}`]) }
                    } else { values.push(["identifier", "---"]) }

                  })
                }
              })
            }
            //console.log(values)
            const registoInstance = createTableRegistoLinha("Schedule", values, "td");
            tableFares.appendChild(registoInstance)
          }
          isFirstIteration = false;
        }
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("composition-component", Composition);