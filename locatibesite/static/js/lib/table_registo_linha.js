export default function createTableRegistoLinha(type, list, type_cell) {
    // Create a table row element
    const sectionRow = document.createElement("tr");
    sectionRow.id = `row-${type}-tr`;

    // Populate the row with cells based on the provided list
    for (const item of list) {
        const itemn = formatInventoryNumber(item[0]);
        const sectionCell = document.createElement(`${type_cell}`);
        sectionCell.id = `row-${type}-${itemn}-th`;

        // Check if the current item is a URL
        if (item[0] == "URL") {
            const linkElement = document.createElement("a");
            linkElement.textContent = item[1];
            linkElement.href = item[1];
            linkElement.target = "_blank";
            sectionCell.appendChild(linkElement);
        } else {
            sectionCell.textContent = `${item[1]}`;
            if (item[2]){sectionCell.colSpan = item[2]}
        }

        // Append the cell to the row
        sectionRow.appendChild(sectionCell);
    }
    return sectionRow

}

function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, function (str) { return str.toUpperCase(); });
}