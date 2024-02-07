class PostalAddress extends HTMLElement {
  constructor() {
    super();

    // Create a Shadow DOM for the custom element
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Append the template content to the Shadow DOM
    shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

    // Variavel que aponta para os ficheiros css e json
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
          <div id="postal_address"></div>
        </div>
      `;
      return template;
    }



    populateElements(data, css, pointers) {
      const shadowRoot = this.shadowRoot;
      shadowRoot.getElementById("css").setAttribute("href", css);
      
      const postal_address = shadowRoot.getElementById("postal_address");

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

        let variables = []
        
        if (path.address){
          variables.push(`${path.address}, `)
        }

        if (path.freguesia){
          variables.push(`${path.freguesia}, `)
        }

        if (path.streetAddress){
          variables.push(`${path.streetAddress}, `)
        }

        if (path.addressLocality){
          variables.push(`${path.addressLocality}, `)
        }

        if (path.postalCode){
          variables.push(`${path.postalCode} `)
        }

        if (path.addressRegion){
          variables.push(`${path.addressRegion} `)
        }

        if (path.addressCountry){
          variables.push(` - ${path.addressCountry}`)
        }

        let string = ""
        for (const variable of variables) {
          string += String(variable)
        }

        const div = document.createElement("div")
        div.classList.add("padding")
        div.classList.add("in-line-container")

        const icon = document.createElement("ion-icon");
        icon.setAttribute("name", "location-outline");

        const row = document.createElement("p");
        row.id = `postalAddress2`
        row.textContent = `Morada: ${string}`;
        
        div.appendChild(icon);
        div.appendChild(row);

        postal_address.appendChild(div)


      }



    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }

    }

    customElements.define("postal-address-component", PostalAddress);