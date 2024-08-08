export default function createTableRegisto(type, list, type_cell) {
    try {
        const sectionRow = document.createElement("tr");
        sectionRow.id = `row-${type}-tr`;

        const [property, value] = list;
        const itemn = formatInventoryNumber(property);
        const sectionCell = document.createElement(`th`);

        sectionCell.id = `row-${type}-${itemn}-th`;
        sectionCell.textContent = `${itemn}`;

        const valueCell = document.createElement("td")
        valueCell.id =`row-${type}-${value}-td`;
        valueCell.textContent = value;

        sectionRow.appendChild(sectionCell);
        sectionRow.appendChild(valueCell);
        return sectionRow;

    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function (str) { return str.toUpperCase(); });
}
