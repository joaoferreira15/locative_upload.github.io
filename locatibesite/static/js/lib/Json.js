class Json extends HTMLElement {
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

    static get observedAttributes() {
        // Lista de atributos que você deseja observar as mudanças
        return ['css', "json", "pointers"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      //console.log(`Attribute '${name}' changed from '${oldValue}' to '${newValue}'`);
      if (oldValue !== newValue && oldValue !== null) {
          // Only proceed if the value of the observed attribute has actually changed
          switch (name) {
              case 'css':
                  this.updateCSS(newValue);
                  break;
              case 'json':
                  this.updateJSON(newValue);
                  break;
              case 'pointers':
                  this.updatePointers(newValue);
                  break;
          }
      }
  }

    updateCSS(cssUrl) {
        // Lógica para atualizar a folha de estilo com o novo URL
        const cssLink = this.shadowRoot.getElementById('css');
        cssLink.setAttribute('href', cssUrl);
    }

    updateJSON(jsonUrl) {
        // Lógica para lidar com a alteração do atributo 'json'
        this.fetchData(jsonUrl)
            .then(data => this.populateElements(data, this.getAttribute('css'), JSON.parse(this.getAttribute('pointers').replace(/'/g, '"'))))
            .catch(error => this.handleError(error));
    }

    updatePointers(pointersValue) {
        // Lógica para lidar com a alteração do atributo 'pointers'
        const pointers = JSON.parse(pointersValue.replace(/'/g, '"'));
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
          <div id="aresentacao" class="all_centredR">
            <div id="json_data"></div>
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
            path = currentData;}
      } else {
          path = data;
      }

        const n_rows = Object.keys(path).length
        const json_data = shadowRoot.getElementById("json_data")

        
        if (path){
            const jsonString = JSON.stringify(path, null, 2); // 2 spaces for indentation

            const pre = document.createElement('pre');
            pre.textContent = jsonString;
            pre.setAttribute("style", "font-size: 12px");

            json_data.appendChild(pre);
        }
    }
    
    

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

}

customElements.define("json-component", Json);