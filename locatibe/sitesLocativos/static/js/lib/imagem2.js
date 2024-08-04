export function populateImagem(type, key, value) {
    const row = document.createElement("img");
    row.id = "imagem-component"
    row.setAttribute("name", `${type}Imagem`)
    if (key != "") {
        row.classList.add(key)
    }
    row.src = value;

    return row
}
