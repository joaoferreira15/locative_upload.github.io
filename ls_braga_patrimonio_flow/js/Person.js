import createDescription from "./description.js";
import createTitulo from "./titulo.js";
import createRegisto from "./registo.js";
import createImagem from "./imagem.js";
import createLink from "./link.js";

class Person extends HTMLElement {
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
        console.log(pointers_string)
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
              <div id="person_data"></div>
            </div>
          </div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
        const shadowRoot = this.shadowRoot;
        shadowRoot.getElementById("css").setAttribute("href", css);
        const keys = pointers[0]["path"].split('.');

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

            const person_data = shadowRoot.getElementById("person_data");
            const imagem = shadowRoot.getElementById("imagem");
            const container = shadowRoot.getElementById("containerBorder");
            const papel = shadowRoot.getElementById("papel");


            if (path.image){

              const div = document.createElement("div")
              div.classList.add("apresentacao3")

              const registoInstance = createImagem("Person", "logo", path.image);
              div.appendChild(registoInstance)
              imagem.appendChild(div)

            }

            if (!path.image){

              const div = document.createElement("div")
              div.classList.add("apresentacao3")

              const registoInstance = createImagem("Person", "logo", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
              div.appendChild(registoInstance)
              imagem.appendChild(div)

            }

            if (path.name){

              const registoInstance = createTitulo("Person", "", lastKey);
              const registoInstance2 = createTitulo("Person", "", path.name);
              registoInstance.classList.add("centrado", "MTzero", "MBzero")
              registoInstance2.classList.add("centrado")

              papel.appendChild(registoInstance)  

              //if (path.affiliation){
              if (path.type){

                const registoInstance3 = createRegisto("Person", "", path.type, "");
                registoInstance3.classList.add("MTzero", "centrado")
                registoInstance2.classList.add("MBzero")

                person_data.appendChild(registoInstance2)
                person_data.appendChild(registoInstance3)  

              } else {

                person_data.appendChild(registoInstance2)

              }
            }

            if (path.birthDate){
              const registoInstance = createRegisto("Person", "", `Data de Nascimento: ${path.birthDate}`, "");
              registoInstance.classList.add("centrado")
              person_data.appendChild(registoInstance)
            }

            if (path.deathDate){
              const registoInstance = createRegisto("Person", "", `Data de Falecimento: ${path.deathDate}`, "");
              registoInstance.classList.add("centrado")
              person_data.appendChild(registoInstance)
            }

            if (path.description){
              const sup_div = document.createElement("div")
              sup_div.classList.add("centrado", "apresentacaoT")
              const div = document.createElement("div")

              const registoInstance = createDescription("Person","", path.description, "");
              div.appendChild(registoInstance);
              sup_div.appendChild(div)

              person_data.appendChild(sup_div)
            }
        }
    

    
    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("person-component", Person);