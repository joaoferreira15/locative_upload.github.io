export default function createTableTitulo(type, value, size) {
    try {
        const typen = formatInventoryNumber(String(type));

        const sectionRow = document.createElement("tr");
        sectionRow.id = `row-${type}-${value}-tr`;
        const sectionCell = document.createElement("th");
        sectionCell.id = `row-${type}-${value}-th`;
        sectionCell.textContent = `${typen}`;
        sectionCell.colSpan = size;
        sectionRow.appendChild(sectionCell);
        
        return sectionRow;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function (str) { return str.toUpperCase(); });
}