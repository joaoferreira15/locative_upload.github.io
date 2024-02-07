import createImagem from './imagem.js';
import createRegisto from "./registo.js";
import createTitulo from "./titulo.js";

class Images extends HTMLElement {
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
        <div id="container" class="container">
          <link rel="stylesheet" type="text/css" id="css" href="">
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
        const container = shadowRoot.getElementById("container");


        if (path.images) {
          const registoInstance = createTitulo("Images", "", "Fotografias");
          registoInstance.classList.add("padding")
          registoInstance.setAttribute("style", "font-size: 24px")

          container.appendChild(registoInstance)

          for (let i = 0; i < path.images.length; i++) {
            const image_item = path.images[i];

            const apresentacao = document.createElement('div'); 
            apresentacao.setAttribute('id', 'apresentacaoImage');
            container.appendChild(apresentacao)

            const imagem = document.createElement('div'); 
            imagem.setAttribute('id', 'imagem');
            apresentacao.appendChild(imagem)

            const image_data = document.createElement('div'); 
            image_data.setAttribute('id', 'image_data');
            apresentacao.appendChild(image_data)

          if (image_item.url){
              image_data.classList.add("centrado")
              const registoInstance = createImagem("Images", "imagem", image_item.url);

              apresentacao.classList.add("DBorderImage")
              container.classList.add("image_list")

              imagem.appendChild(registoInstance)

              if (image_item.caption){
                const registoInstance = createRegisto("Images", "", image_item.caption, "");
                registoInstance.classList.add("padding", "MTzero", "small")
      
                image_data.appendChild(registoInstance)
              }
            }
          }
        }
    }
    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("images-component", Images);