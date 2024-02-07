import createTitulo from "./titulo.js";
import createImagem from './imagem.js';
import createLink from "./link.js";
import createRegisto from "./registo.js";
import createDescription from "./description.js";

class Caracterization extends HTMLElement {
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
            <div id="apresentacao">      
              <div id="imagem"></div>
              <div id="caracterization_data"></div>
          </div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);

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

        const n_rows = Object.keys(path).length

        const caracterization_data = shadowRoot.getElementById("caracterization_data")
        const imagem = shadowRoot.getElementById("imagem");

        if (path.name){
          if (n_rows <= 2 && !path.image) {
              const div = document.createElement("div")
              div.classList.add("in-line-container")
              div.classList.add("padding")

              const icon = document.createElement("ion-icon");
              icon.setAttribute("name", "person-outline");
              const registoInstance = createRegisto("Caracterization", lastKey, path.name, "");

              div.appendChild(icon);
              div.appendChild(registoInstance);

              caracterization_data.appendChild(div)  

          } else {

            if (path.type){
  
              const registoInstance2 = createRegisto("Caracterization", "", path.type, "");
              registoInstance2.classList.add("padding", "MTzero", "small")
              
              const registoInstance = createTitulo("Caracterization", "", path.name);
              registoInstance.classList.add("padding", "MBzero")

              caracterization_data.appendChild(registoInstance)
              caracterization_data.appendChild(registoInstance2)

            } else {

              const registoInstance = createTitulo("Caracterization", "", path.name);
              registoInstance.classList.add("padding")
              
              caracterization_data.appendChild(registoInstance)

            }
          }
        }

        //if (path.identifier){
        if (path.id){
          const div = document.createElement("div")
          div.classList.add("in-line-container")

          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "clipboard-outline");
          const registoInstance = createRegisto("Caracterization", "ID", path.id, "");
          div.classList.add("padding")

          div.appendChild(icon);
          div.appendChild(registoInstance);

          caracterization_data.appendChild(div)
        }

        if (path.description){
          const sup_div = document.createElement("div")
          sup_div.classList.add("centrado")
          const div = document.createElement("div")
          div.classList.add("apresentacao2")
          div.setAttribute("style", "margin-bottom: 15px")

          const registoInstance = createDescription("Caracterization","", path.description, "");
          div.appendChild(registoInstance);
          sup_div.appendChild(div)

          caracterization_data.appendChild(sup_div)
        }

        if (path.material){

          const div = document.createElement("div")
          div.classList.add("padding", "in-line-container")
  
          const icon = document.createElement("ion-icon");
          icon.setAttribute("name", "construct-outline");
  
          const registoInstance = createRegisto("Specific", "", `Construído com "${path.material}"`, "MBzero");
          
          div.appendChild(icon);
          div.appendChild(registoInstance);

          caracterization_data.appendChild(div)

        }

        if (path.photo.url){    
          const div = document.createElement("div")
          div.classList.add("apresentacao3")

          const registoInstance = createImagem("Caracterization", "imagem", path.photo.url);
          div.appendChild(registoInstance)
          imagem.appendChild(div)
        }
        
      }
    
    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("caracterization-component", Caracterization);