export default class Titulo extends HTMLElement {
  constructor(type, key, value, classV = null) {
      super();

      // Fetch data from JSON and populate the elements
      this.populateElements(type, key, value, classV, (row) => {
          this.appendChild(row);
      });
  }

  formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, function (str) { return str.toUpperCase(); });
  }

  populateElements(type, key, value, classV, callback) {
    const keyn = this.formatInventoryNumber(key);
    const valuen = this.formatInventoryNumber(value);

      try {
          // Create the elements directly
          const row = document.createElement("h2");
          row.id = `${type}Titulo`;
          if (key == "") {
            row.textContent = `${valuen}`;
          }
          
          if (value = ""){
            row.textContent = `${keyn}`;
          }

          if (key != "" && value != "") {
            row.textContent = `${keyn}: ${value}`;
          }

          if (classV !== "") {
            if (typeof classV === "string") {
                row.classList.add(classV);
            } else if (Array.isArray(classV)) {
                for (const cls of classV) {
                    row.classList.add(cls);
                }
            }
          }
          callback(row);

      } catch (error) {
          this.handleError(error);
      }
  }

  handleError(error) {
      console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

customElements.define("titulo-component", Titulo);