export default class SubTitulo extends HTMLElement {
    constructor(type, key, value) {
        super();
  
        // Fetch data from JSON and populate the elements
        this.populateElements(type, key, value, (row) => {
            this.appendChild(row);
        });
    }
  
    formatInventoryNumber(input) {
        return input.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); });
    }
  
    populateElements(type, key, value) {
        const keyn = this.formatInventoryNumber(key)

        try {
            const row = document.createElement("h3");
            row.id = `${type}SubTitulo`
            row.classList.add("centrado")
            if (key == ""){
                row.textContent = `${value}`;
            } else {
                row.textContent = `${keyn}: ${value}`;
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
  
  customElements.define("sub-titulo-component", SubTitulo);
  