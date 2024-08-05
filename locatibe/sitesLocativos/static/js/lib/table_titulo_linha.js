export default function createTableTituloLinha(type, list, type_cell) {
    // Create a table row element
    const sectionRow = document.createElement("tr");
    sectionRow.id = `row-${type}-tr`;

    // Populate the row with cells based on the provided list
    for (const item of list) {
        const itemn = formatInventoryNumber(String(item[0]));
        const sectionCell = document.createElement(`${type_cell}`);
        sectionCell.id = `row-${type}-${item[0]}-th`;
        sectionCell.textContent = `${item[1]}`;
        if (item[2]){sectionCell.colSpan = item[2]}

        // Append the cell to the row
        sectionRow.appendChild(sectionCell);
    }
    return sectionRow
}

function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function (str) { return str.toUpperCase(); });
}
