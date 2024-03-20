import createTableRegistoLinha from "./lib/table_registo_linha.js";
import createTableTituloLinha from "./lib/table_titulo_linha.js";

import { fetchData, getPathFromPointers } from "./lib/functions.js"

class Fares extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    //variavel que aponta para os ficheiros css e json
    const css = this.getAttribute("css");
    const json = this.getAttribute("json");
    const produto = this.getAttribute("produto");
    const map = this.getAttribute("map");
    const pointers_string = this.getAttribute("pointers");
    const pointers = JSON.parse(pointers_string.replace(/'/g, '"'));

    // Fetch data from JSON and populate the elements
    fetchData(json)
      .then(data => this.populateElements(data, css, pointers))
      .catch(error => this.handleError(error));
  }



  static get observedAttributes() {
    // Lista de atributos que você deseja observar as mudanças
    return ['css', "json", "pointers", "pattern", "produto", "map"];
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

      fetchData(this.getAttribute('json'))
        .then(data => this.populateElements(data, this.getAttribute('css'), JSON.parse(this.getAttribute('pointers').replace(/'/g, '"')), this.getAttribute('pattern'), this.getAttribute('produto'), this.getAttribute('map')))
        .catch(error => this.handleError(error));
    }
  }



  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div id="container" class="container custom-container">
        <link rel="stylesheet" type="text/css" id="css" href="">
        <div id="apresentacao" class="text-left">      
          <div id="fares_data"></div>
        </div>
      </div>
      `;
    return template;
  }



  populateElements(data, css, pointers,) {
    const shadowRoot = this.shadowRoot;
    shadowRoot.getElementById("css").setAttribute("href", css);

    const fares_data = this.shadowRoot.getElementById("fares_data");

    // Access the nested structure using the parts
    let keysToSearchList = ["hasFares"];
    const resultList = getPathFromPointers(data, pointers, keysToSearchList);

    for (const keytoSearch of keysToSearchList) {
      for (const { path, lastKey } of resultList) {
        const n_rows = Object.keys(path).length
        //console.log("path", path)

        path.forEach(list => {
          for (const [key, value] of Object.entries(list)) {
            let isFirstIteration = true;
            //console.log("value", value)
            //console.log("keytoSearch", keytoSearch)
            //console.log("key", key)
            //console.log("hasRoute", list.hasOwnProperty("hasRoute"))





            if (keytoSearch == "hasRoute" && key == "hasRoute" && list.hasOwnProperty("hasRoute")) {
              //console.log("funcionou")

              if (isFirstIteration) {
                const tableTrips = document.createElement("table");
                tableTrips.id = "faresTripsTable";
                tableTrips.classList.add("custom-table")
                fares_data.appendChild(tableTrips);
                //console.log("criou")
              } else {
                //console.log("não é a 1º iteration")
              }
              //console.log("second value", value)
              //console.log("value.id", value.id)

              const tableTrips = this.shadowRoot.getElementById("faresTripsTable");
              let values = []

              if (value.id || value.name || value.shortName) {
                values.push(["route", `Route`])
              }
              if (value.id) {
                values.push(["route", `${value.id}`])
              } else { values.push(["identifier", "---"]) }

              if (value.name) {
                let size = 3
                if (value.id) { size = 2 }
                if (value.shortName) {
                  values.push(["name", `${value.shortName} - ${value.name}`, size])
                } else { values.push(["name", `${value.name}`, size]) }
              } else { values.push(["name", "---"]) }

              const registoInstance = createTableRegistoLinha("Fares", values, "th");
              //console.log("registoInstance")
              tableTrips.appendChild(registoInstance)

              if (value.hasTrips) {
                let trips = value.hasTrips
                trips.forEach(tripItem => {

                  let values = []

                  if (tripItem.id || tripItem.headSign) {
                    values.push(["trip", `Trip`])
                  }

                  if (tripItem.id) {
                    values.push(["identifier", `${tripItem.id}`])
                  } else { values.push(["identifier", "---"]) }

                  if (tripItem.headSign) {
                    let size = 3
                    if (value.id) {
                      size = 2
                    }
                    values.push(["headSign", `${tripItem.headSign}`, size])
                  } else { values.push(["headSign", "---"], size) }

                  const registoInstance2 = createTableRegistoLinha("Fares", values, "th");
                  tableTrips.appendChild(registoInstance2)

                  if (tripItem.hasStopTimes) {
                    let stopTimes = tripItem.hasStopTimes
                    stopTimes.forEach(item => {

                      let values = []
                      let titles = []
                      //console.log("item", item)
                      if (Object.keys(item).length > 0) {
                        titles = [["stop", "Stop"], ["name", "Name"], ["arrivalTime", "Arrival Time"], ["price", "Price"]]
                        const registoInstance = createTableTituloLinha("Fares", titles, "th");
                        tableTrips.appendChild(registoInstance)
                      }

                      if (item.hasStop) {
                        //console.log("hasStop", item.hasStop)
                        let stopItem = item.hasStop

                        if (stopItem.id) {
                          values.push(["identifier", `Stop: ${stopItem.id}`])
                        } else { values.push(["identifier", "---"]) }

                        if (stopItem.name) {
                          values.push(["name", `${stopItem.name}`])
                        } else { values.push(["name", "---"]) }
                      }

                      if (item.arrivalTime) {
                        values.push(["arrivalTime", `${item.arrivalTime}`])
                      } else { values.push(["arrivalTime", "---"]) }

                      if (item.price) {
                        if (item.priceCurrency) {
                          values.push(["price", `${item.price} ${item.priceCurrency}`])
                        } else { values.push(["price", `${item.price} EUR`]) }
                      } else { values.push(["price", "---"]) }

                      //console.log("values", values)
                      const registoInstance3 = createTableRegistoLinha("Fares", values, "td");
                      tableTrips.appendChild(registoInstance3)
                    })
                  }
                })
              }
              keysToSearchList = keysToSearchList.filter(item => item !== "hasRoute");
            }





            if (keytoSearch == "hasStop" && key == "hasStop" && list.hasOwnProperty("hasStop")) {
              if (isFirstIteration) {
                const tableStops = document.createElement("table");
                tableStops.id = "faresStopsTable";
                tableStops.classList.add("custom-table")
                fares_data.appendChild(tableStops);
              }

              const tableStops = this.shadowRoot.getElementById("faresStopsTable");
              let titles = []
              let values = []

              if (Object.keys(value).length > 0) {
                titles = [["trip", "Trip"], ["route", "Route"], ["arrivalTime", "Arrival Time"], ["price", "Price"]]
                const registoInstance4 = createTableTituloLinha("Fares", titles, "th");
                tableStops.appendChild(registoInstance4)
              }

              if (value.hasStopTimes) {
                let stopTimes = value.hasStopTimes

                stopTimes.forEach(item => {
                  if (item.hasTrip) {
                    let tripItem = item.hasTrip

                    if (tripItem.id) {
                      if (tripItem.headSign) {
                        values.push(["identifier", `${tripItem.id}-${tripItem.headSign}`])
                      } else if (!tripItem.headSign) { values.push(["identifier", `${tripItem.id}`]) }
                    } else { values.push(["identifier", "---"]) }

                    if (tripItem.hasRoute) {
                      let routeItem = tripItem.hasRoute

                      if (routeItem.id) {
                        if (routeItem.name) {
                          values.push(["route", `${routeItem.id}-${routeItem.name}`])
                        } else if (!routeItem.id) { values.push(["route", `${routeItem.id}`]) }
                      } else { values.push(["nameRoute", "---"]) }
                    }
                  }

                  if (item.arrivalTime) {
                    values.push(["arrivalTime", `${item.arrivalTime}`])
                  } else { values.push(["arrivalTime", "---"]) }

                  if (item.price) {
                    if (item.priceCurrency) {
                      values.push(["price", `${item.price} ${item.priceCurrency}`])
                    } else { values.push(["price", `${item.price} EUR`]) }
                  } else { values.push(["price", "---"]) }

                })
              }

              const registoInstance5 = createTableRegistoLinha("Fares", values, "td");
              tableStops.appendChild(registoInstance5)

              keysToSearchList = keysToSearchList.filter(item => item !== "hasStop");
            }
            isFirstIteration = false;
          }
        })
      }
    }
  }



  handleError(error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }

}

customElements.define("fares-component", Fares);  