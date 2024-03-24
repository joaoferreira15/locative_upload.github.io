export default class Link extends HTMLElement {
    constructor(type, key, value, url, classV) {
        super();

        // Fetch data from JSON and populate the elements
        this.populateElements(type, key, value, url, classV, (row) => {
            this.appendChild(row);
        });
    }

    formatInventoryNumber(input) {
        return input.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); });
    }

    populateElements(type, key, value, url, classV, callback) {
        try {
            const row = document.createElement("a");
            row.id = `${type}Link`
            row.textContent = value
            
            if (url.startsWith("https")) { row.href = url = url; } 
            else { row.href = url = `${url}.html`; }
            
            row.target = "_blank";

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

customElements.define("link-component", Link);
