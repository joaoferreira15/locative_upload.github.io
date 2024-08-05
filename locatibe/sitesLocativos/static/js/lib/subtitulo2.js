export default class SubTitulo extends HTMLElement {
    constructor(type = null, key = null, value = null) {
        super();

        // Fetch data from JSON and populate the elements
        if (type != null || this.getAttribute("type") != null) { this.type = type ? type : this.getAttribute("type"); }

        if (key != null || this.getAttribute("key") != null) { this.key = key ? key : this.getAttribute("key"); }

        if (value != null || this.getAttribute("value") != null) { this.value = value ? value : this.getAttribute("value"); }

        this.attachShadow({ mode: "open" });
        this.populateElements(this.type, this.key, this.value)
    }

    formatInventoryNumber(input) {
        return input.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); });
    }

    populateElements(type, key, value) {
        const keyn = this.formatInventoryNumber(key)

        const row = document.createElement("h3");
        row.id = `${type}SubTitulo`
        row.classList.add("centrado")
        if (key == "") {
            row.textContent = `${value}`;
        } else {
            row.textContent = `${keyn}: ${value}`;
        }
        this.shadowRoot.appendChild(row)
    }

    handleError(error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

customElements.define("sub-titulo2-component", SubTitulo);
