export default class Description extends HTMLElement {
  constructor(type, key, value, classV) {
      super();

      // Fetch data from JSON and populate the elements
      this.populateElements(type, key, value, classV, (row) => {
          this.appendChild(row);
      });
  }

  populateElements(type, key, value, classV, callback) {
      try {
          const div = document.createElement("div")

          if (key != "") {
            const title = document.createElement("h4");
            title.textContent = "Description";
            title.classList.add("centrado");
    
            div.appendChild(title)
          }
    
          const row = document.createElement("p");
          row.id = `${type}Description`;
          row.classList.add("centrado", "paddingL");
          if (classV !== "") {
            if (typeof classV === "string") {
                row.classList.add(classV);
            } else if (Array.isArray(classV)) {
                for (const cls of classV) {
                    row.classList.add(cls);
                }
            }
          }
          row.textContent = `${value}`;
          div.appendChild(row)

          callback(div);
          
      } catch (error) {
          this.handleError(error);
      }
  }

  handleError(error) {
      console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

customElements.define("description-component", Description);
