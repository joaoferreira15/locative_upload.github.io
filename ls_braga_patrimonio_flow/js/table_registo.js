function createTableRegisto(type, key, value) {

    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }


    function populateElements(type, key, value) {
      const keyn = formatInventoryNumber(String(key))

      const sectionRow = document.createElement("tr");
      sectionRow.id =`row-${type}-${key}-tr`;
      const sectionCell = document.createElement("th")
      sectionCell.id =`row-${type}-${key}-th`;
      sectionCell.textContent = `${keyn}`;
      const valueCell = document.createElement("td")
      valueCell.id =`row-${type}-${key}-td`;
      valueCell.textContent = value;
      
      sectionRow.appendChild(sectionCell);
      sectionRow.appendChild(valueCell);

      return sectionRow
     }

     const tableRegisto = populateElements(type, key, value);
     return tableRegisto
}

export default createTableRegisto;