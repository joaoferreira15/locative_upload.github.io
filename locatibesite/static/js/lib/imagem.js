export default class Imagem extends HTMLElement {
  constructor(type, key, value) {
      super();

      // Fetch data from JSON and populate the elements
      this.populateElements(type, key, value, (row) => {
          this.appendChild(row); // Append to the custom element directly
      });
  }

  populateElements(type, key, value, callback) {
      try {
          const row = document.createElement("img");
          row.id = `${type}_${key}_image`
          if (key != ""){
            row.classList.add(key)
          }
          row.src = value;
          callback(row);
      } catch (error) {
          this.handleError(error);
      }
  }

  handleError(error) {
      console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

customElements.define("imagem-component", Imagem);
