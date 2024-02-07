import createRegisto from "./registo.js";
import createTitulo from "./titulo.js";

class Inventory extends HTMLElement {
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
        this.fetchData(json)
            .then(data => this.populateElements(data, css, pointers))
            .catch(error => this.handleError(error));
    }



    async fetchData(json) {
      try {
          const response = await fetch(json);
          return await response.json();
      } catch (error) {
          throw error;
      }
    }



    getTemplate() {
      const template = document.createElement("template");
      template.innerHTML = `
        <div class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="inventory_data"></div>
        </div>
      `;
      return template;
    }


    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);
      const inventory_data = shadowRoot.getElementById("inventory_data")

      // Access the nested structure using the parts
      let path = "";
      let lastKey = "";

      const pointerPath = pointers[0].path;

      if (typeof pointerPath === 'string' && pointerPath.trim() !== '') {
        // Use uma expressão regular para encontrar todas as ocorrências de texto entre colchetes
        const keys = pointerPath.match(/\w+/g);
    
        if (keys && keys.length > 0) {
            let currentData = data;
    
            for (let i = 0; i < keys.length; i++) {
                lastKey = keys[i];
                currentData = currentData[lastKey];
            }
    
            path = currentData;
        }
    } else {
        path = data;
    }


        if (path.inventoryNumber || path.dateInInventory){
        
          const registoInstance = createTitulo("Iventory", "", "Informações sobre Inventário" );
          registoInstance.classList.add("padding")
          registoInstance.classList.add("MBzero")
          inventory_data.appendChild(registoInstance);
        }

        if (path.inventoryNumber){

          const div = document.createElement("div")
          div.classList.add("in-line-container")
          div.classList.add("padding")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "clipboard-outline");
          const registoInstance = createRegisto("inventory","", `Assume a identificação ${path.inventoryNumber}`);

          div.appendChild(icon);
          div.appendChild(registoInstance);

          inventory_data.appendChild(div)
        
        }
  
        if (path.dateInInventory) {

          const div = document.createElement("div")
          div.classList.add("in-line-container")
          div.classList.add("padding")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "calendar-outline");
          const registoInstance = createRegisto("inventory","dateInInventory", path.dateInInventory);

          div.appendChild(icon);
          div.appendChild(registoInstance);

          inventory_data.appendChild(div)
        }
    }
    
    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("inventory-component", Inventory);