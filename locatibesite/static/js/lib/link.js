export default class Link extends HTMLElement {
    constructor(type, key, value) {
        super();
  
        // Fetch data from JSON and populate the elements
        this.populateElements(type, key, value, (row) => {
            this.appendChild(row);
        });
    }

    populateElements(type, key, value) {

        try {
            const row = document.createElement("a");
            row.id = `${type}_${key}`
            row.classList.add("centrado")
            if (key == "branco") {
                row.classList.add("branco")
            }
            row.textContent = value
            row.href = value;
            row.target = "_blank";
            callback(row);

        } catch (error) {
            this.handleError(error);
        }
    }
  
    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
  }
  
  customElements.define("link-component", Link);
  