import createTableRegistoLinha from "./lib/table_registo_linha.js";
import createTableTituloLinha from "./lib/table_titulo_linha.js";

import { fetchData, getPathFromPointers, updateValue, isValidJsonString } from "./lib/functions.js"

class Schedule extends HTMLElement {
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
      const schedule_data = this.shadowRoot.getElementById("schedule_data");
      schedule_data.innerHTML = "";

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
          <div id="schedule_data"></div>
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

    const schedule_data = this.shadowRoot.getElementById("schedule_data");

    // Access the nested structure using the parts
    let keysToSearchList = ["hasRoute", "hasStop"];
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

              //if (isFirstIteration) {
              const tableTrips = document.createElement("table");
              tableTrips.id = "scheduleTripsTable";
              tableTrips.classList.add("custom-table")
              schedule_data.appendChild(tableTrips);
              //console.log("criou")
              //}

              //console.log("second value", value)
              //console.log("value.id", value.id)

              //const tableTrips = this.shadowRoot.getElementById("scheduleTripsTable");
              let values = []

              if (value.id || value.longName || value.shortName) {
                values.push(["route", `Route`])
              }
              if (value.id) {
                values.push(["route", `${value.id}`])
              } else { values.push(["identifier", "---"]) }

              if (value.longName) {
                let size = 2
                if (value.id) { size = 1 }
                if (value.shortName) {
                  values.push(["name", `${value.shortName} - ${value.longName}`, size])
                } else { values.push(["name", `${value.longName}`, size]) }
              } else { values.push(["name", "---"]) }

              const registoInstance = createTableRegistoLinha("Schedule", values, "th");
              //console.log("registoInstance")
              tableTrips.appendChild(registoInstance)

              if (value.hasTrips) {
                let trips = value.hasTrips
                trips.forEach(tripItem => {

                  let values = []

                  if (tripItem.id || tripItem.tripHeadSign) {
                    values.push(["trip", `Trip`])
                  }

                  if (tripItem.id) {
                    values.push(["identifier", `${tripItem.id}`])
                  } else { values.push(["identifier", "---"]) }

                  if (tripItem.tripHeadSign) {
                    let size = 2
                    if (value.id) { size = 1 }
                    values.push(["tripHeadSign", `${tripItem.tripHeadSign}`, size])
                  } else { values.push(["tripHeadSign", "---"], size) }

                  const registoInstance2 = createTableRegistoLinha("Schedule", values, "th");
                  tableTrips.appendChild(registoInstance2)

                  if (tripItem.hasStopTimes) {
                    let stopTimes = tripItem.hasStopTimes
                    stopTimes.forEach(item => {

                      let values = []
                      let titles = []
                      //console.log("item", item)
                      if (Object.keys(item).length > 0) {
                        //titles = [["stop", "Stop"], ["name", "Name"], ["arrivalTime", "Arrival Time"], ["price", "Price"]]
                        titles = [["stop", "Stop"], ["name", "Name"], ["arrivalTime", "Arrival Time"]]
                        const registoInstance = createTableTituloLinha("Schedule", titles, "th");
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

                      //if (item.price) {
                      //  if (item.priceCurrency) {
                      //    values.push(["price", `${item.price} ${item.priceCurrency}`])
                      //  } else { values.push(["price", `${item.price} EUR`]) }
                      //} else { values.push(["price", "---"]) }

                      //console.log("values", values)
                      const registoInstance3 = createTableRegistoLinha("Schedule", values, "td");
                      tableTrips.appendChild(registoInstance3)
                    })
                  }
                })
              }
              keysToSearchList = keysToSearchList.filter(item => item !== "hasRoute");
            }





            if (keytoSearch == "hasStop" && key == "hasStop" && list.hasOwnProperty("hasStop")) {
              //if (isFirstIteration) {
              const tableStops = document.createElement("table");
              tableStops.id = "scheduleStopsTable";
              tableStops.classList.add("custom-table")
              schedule_data.appendChild(tableStops);
              //}

              //const tableStops = this.shadowRoot.getElementById("scheduleStopsTable");
              let titles = []
              let values = []

              if (Object.keys(value).length > 0) {
                //titles = [["trip", "Trip"], ["route", "Route"], ["arrivalTime", "Arrival Time"], ["price", "Price"]]
                titles = [["trip", "Trip"], ["route", "Route"], ["arrivalTime", "Arrival Time"]]
                const registoInstance4 = createTableTituloLinha("Schedule", titles, "th");
                tableStops.appendChild(registoInstance4)
              }

              if (value.hasStopTimes) {
                let stopTimes = value.hasStopTimes

                stopTimes.forEach(item => {
                  if (item.hasTrip) {
                    let tripItem = item.hasTrip

                    if (tripItem.id) {
                      if (tripItem.tripHeadSign) {
                        values.push(["identifier", `${tripItem.id}-${tripItem.tripHeadSign}`])
                      } else if (!tripItem.tripHeadSign) { values.push(["identifier", `${tripItem.id}`]) }
                    } else { values.push(["identifier", "---"]) }

                    if (tripItem.hasRoute) {
                      let routeItem = tripItem.hasRoute

                      if (routeItem.id) {
                        if (routeItem.longName) {
                          values.push(["route", `${routeItem.id}-${routeItem.longName}`])
                        } else if (!routeItem.id) { values.push(["route", `${routeItem.id}`]) }
                      } else { values.push(["nameRoute", "---"]) }
                    }
                  }

                  if (item.arrivalTime) {
                    values.push(["arrivalTime", `${item.arrivalTime}`])
                  } else { values.push(["arrivalTime", "---"]) }

                  //if (item.price) {
                  //  if (item.priceCurrency) {
                  //    values.push(["price", `${item.price} ${item.priceCurrency}`])
                  //  } else { values.push(["price", `${item.price} EUR`]) }
                  //} else { values.push(["price", "---"]) }

                })
              }

              const registoInstance5 = createTableRegistoLinha("Schedule", values, "td");
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

customElements.define("schedule-component", Schedule);  