import createRegisto from "./registo.js";
import createTitulo from "./titulo.js";
import createDescription from "./description.js";
import createImagem from "./imagem.js";
import createLink from "./link.js";

class Organization extends HTMLElement {
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
      <div class="centrado">
        <div id="containerBorder" class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="apresentacao">      
              <div id="papel" class="apresentacaoB"></div> 
              <div id="imagem"></div>
              <div id="organization_data"></div>
          </div>
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

        const organization_data = shadowRoot.getElementById("organization_data");
        const imagem = shadowRoot.getElementById("imagem");
        const container = shadowRoot.getElementById("containerBorder");
        const papel = shadowRoot.getElementById("papel");


        if (path.logo){

          const div = document.createElement("div")
          div.classList.add("apresentacao3")

          const registoInstance = createImagem("Organization", "logo", path.logo);
          div.appendChild(registoInstance)
          imagem.appendChild(div)

        }

        if (!path.logo){

          const div = document.createElement("div")
          div.classList.add("apresentacao3")

          const registoInstance = createImagem("Organization", "logo", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
          div.appendChild(registoInstance)
          imagem.appendChild(div)

        }
        
        if (path.name){

          const registoInstance = createTitulo("Organization", "", lastKey);
          const registoInstance2 = createTitulo("Organization", "", path.name);
          registoInstance.classList.add("centrado", "MTzero", "MBzero")
          registoInstance2.classList.add("centrado")

          papel.appendChild(registoInstance)  

          if (path.identifier){

            const registoInstance3 = createRegisto("Organization", "", path.identifier, "");
            registoInstance3.classList.add("MTzero", "centrado")
            registoInstance2.classList.add("MBzero")

            organization_data.appendChild(registoInstance2)
            organization_data.appendChild(registoInstance3)  

          } else {

            organization_data.appendChild(registoInstance2)

          }
        }

        if (path.telephone){
          const registoInstance = createRegisto("Organization", "telephone", path.telephone, "");
          registoInstance.classList.add("centrado")
          organization_data.appendChild(registoInstance)
        }

        if (path.email){
          const registoInstance = createRegisto("Organization", "email", path.email, "");
          registoInstance.classList.add("centrado")
          organization_data.appendChild(registoInstance)
        }

        if (path.description){
          const sup_div = document.createElement("div")
          sup_div.classList.add("centrado", "apresentacaoT")
          const div = document.createElement("div")

          const registoInstance = createDescription("Organization","", path.description, "");
          div.appendChild(registoInstance);
          sup_div.appendChild(div)

          organization_data.appendChild(sup_div)
        }

        if (path.inLanguage){
          const registoInstance = createRegisto("Organization", "inLanguage", path.inLanguage, "");
          registoInstance.classList.add("centrado")
          organization_data.appendChild(registoInstance)
        }

        if (path.timeZone){
          const registoInstance = createRegisto("Organization", "timeZone", path.timeZone, "");
          registoInstance.classList.add("centrado")
          organization_data.appendChild(registoInstance)
        }
     }

    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("organization-component", Organization);