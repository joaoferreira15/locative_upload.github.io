import createRegisto from "./registo.js";
import createTitulo from "./titulo.js";

class Specific extends HTMLElement {
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
          <div id="specific_data" style="margin-bottom: 10px;" ></div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);

      const specific_data = shadowRoot.getElementById("specific_data")

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


        if (path.condition || path.material || path.dateCreated || path.monumentType){

          const registoInstance = createTitulo("Specific", "", "Outras Informações" );
          registoInstance.classList.add("padding")
          registoInstance.classList.add("MBzero")
          specific_data.appendChild(registoInstance);

          
          if (path.condition){

            const div = document.createElement("div")
            div.classList.add("padding")
            div.classList.add("in-line-container")
    
            const icon = document.createElement("ion-icon");
            icon.setAttribute("name", "eye-outline");
    
            const registoInstance = createRegisto("Specific", "", `Econtra-se num "${path.condition}" estado de condição`, "");
            
            div.appendChild(icon);
            div.appendChild(registoInstance);
  
            specific_data.appendChild(div)

          }

          if (path.material){

            const div = document.createElement("div")
            div.classList.add("padding")
            div.classList.add("in-line-container")
    
            const icon = document.createElement("ion-icon");
            icon.setAttribute("name", "construct-outline");
    
            const registoInstance = createRegisto("Specific", "", `Construído com ${path.material}`, "");
            
            div.appendChild(icon);
            div.appendChild(registoInstance);
  
            specific_data.appendChild(div)

          }

          if (path.dateCreated){

            const div = document.createElement("div")
            div.classList.add("padding")
            div.classList.add("in-line-container")
    
            const icon = document.createElement("ion-icon");
            icon.setAttribute("name", "calendar-outline");
    
            const registoInstance = createRegisto("Specific", "", `Criado em ${path.dateCreated}`, "");
            
            div.appendChild(icon);
            div.appendChild(registoInstance);
  
            specific_data.appendChild(div)
          
          }
        }
      }
    
    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("specific-component", Specific);