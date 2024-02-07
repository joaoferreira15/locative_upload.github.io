import createRegisto from "./registo.js";
import createDescription from "./description.js";
import createImagem from "./imagem.js";
import createTitulo from "./titulo.js";

class Pages extends HTMLElement {
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
      <div class="centrado" style="width: 100%;">
        <div id="container" class="container" style="width: 100%; margin-bottom: 0px">
          <link rel="stylesheet" type="text/css" id="css" href="">
          <div id="aresentacao" class="all_centredR">
              <div id="imagem_div" class="centrado"></div>
              <div class="all_centred">
                <div id="title" style="margin-top: 10px"></div>
                <div id="pages_data" class="centrado"></div>
              </div>
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

        const pages_data = shadowRoot.getElementById("pages_data");
        const imagem = shadowRoot.getElementById("imagem_div");
        const title = shadowRoot.getElementById("title");


        if (path.thumbnail){

          const registoInstance = createImagem("Pages", "logo", path.thumbnail);
          imagem.appendChild(registoInstance)

        }

        if (path.title){
          const registoInstance = createTitulo("Pages", "", `${path.title}`);
          registoInstance.classList.add("centrado", "smallTitle", "Mzero")
          title.appendChild(registoInstance)
        }

        if (path.id){
          const registoInstance = createRegisto("Pages", "", `ID: ${path.id}`, "");
          registoInstance.classList.add("centrado", "smallOther", "MTzero")
          pages_data.appendChild(registoInstance)
        }
        
        if (path.description){
            const div = document.createElement("div")
            div.classList.add("centrado", "apresentacaoT")

            const registoInstance = createDescription("Pages","", path.description, "smallDescription");
            div.appendChild(registoInstance);

            pages_data.appendChild(div)
        }
     }

    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("pages-component", Pages);