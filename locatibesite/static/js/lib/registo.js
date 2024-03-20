export default class Registo extends HTMLElement {
  constructor(type, key, value, classV) {
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

      try {
          const row = document.createElement("p");
          row.id = `${type}_${key}`;

          if (key == "") {
              row.textContent = `${value}`;
          } else {
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

customElements.define("registo-component", Registo);
