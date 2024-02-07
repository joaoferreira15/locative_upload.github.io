function createTableTitulo(type, value, size) {

    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }



    function populateElements(type, value, size) {
      const typen = formatInventoryNumber(String(type))

      const sectionRow = document.createElement("tr");
      sectionRow.id =`row-${type}-${value}-tr`;
      const sectionCell = document.createElement("th")
      sectionCell.id =`row-${type}-${value}-th`;
      sectionCell.textContent = `${typen}`;
      sectionCell.colSpan = size
      sectionRow.appendChild(sectionCell)

      return sectionRow
     }

     const tableTitulo = populateElements(type, value, size);
     return tableTitulo

}

export default createTableTitulo
