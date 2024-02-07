import createRegisto from "./registo.js";
import createDescription from "./description.js";


class CreativeWork extends HTMLElement {
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


    
// A representar neste web-component
// id, type, title, description, publisher date of creation, file format and keywords
// id é um url de valor único, utilizado para representar um recurso locativo, composto por um domain id e um domain-unique id
// type é um url que corresponde a um objeto existente a ser representado pelo recurso locativo  

    getTemplate() {
      const template = document.createElement("template");
      template.innerHTML = `
        <div id="container" class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="header_data"></div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);

      const header_data = shadowRoot.getElementById("header_data");
      const container = shadowRoot.getElementById("container");

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
      

      if (path.name){

        const div = document.createElement("div")
        div.classList.add("in-line-container")
        div.classList.add("padding")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "text-outline");
        const registoInstance = createRegisto("Header", "", `Intitulado "${path.name}"`, "");

        div.appendChild(icon);
        div.appendChild(registoInstance);

        header_data.appendChild(div)
      }

        if (path.identifier){

          const div = document.createElement("div")
          div.classList.add("in-line-container")
          div.classList.add("padding")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "clipboard-outline");
          const registoInstance = createRegisto("Header", "", `O Roteiro Locativo assume o identificador [${path.identifier}]`, "");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

        }

        if (path.description){

          const sup_div = document.createElement("div")
          sup_div.classList.add("centrado")
          const div = document.createElement("div")
          div.classList.add("apresentacao2")

          const registoInstance = createDescription("Header","", path.description,"");
          div.appendChild(registoInstance);
          sup_div.appendChild(div)

          header_data.appendChild(sup_div)

        }

        if (path.genre){    

          const div = document.createElement("div")
          div.classList.add("in-line-container")
          div.classList.add("padding")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "information-circle-outline");
          const registoInstance = createRegisto("Header", "", `Este Roteiro Locativo explora ${path.genre}`, "");

          div.appendChild(icon);
          div.appendChild(registoInstance);

          header_data.appendChild(div)

        }

        if (path.datePublished){
          const div = document.createElement("div")
          div.classList.add("padding")
          div.classList.add("in-line-container")
    
          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "calendar-outline");

          const registoInstance = createRegisto("Specific", "", `Criado em ${path.datePublished}`, "");
            
          div.appendChild(icon);
          div.appendChild(registoInstance);
  
          header_data.appendChild(div)
    
        }

        if (path.fileFormat){

          const div = document.createElement("div")
          div.classList.add("padding")
          div.classList.add("in-line-container")
    
          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "document-outline");

          const registoInstance = createRegisto("Specific", "", `Extraído de um ficheiro .${path.fileFormat}`, "");
            
          div.appendChild(icon);
          div.appendChild(registoInstance);
  
          header_data.appendChild(div)

        }
    }

    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("creative-work-component", CreativeWork);