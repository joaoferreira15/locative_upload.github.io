function createTableTituloLinha(type, list, type_cell) {

    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }


    function populateElements(type, list, type_cell) {
      // fetch de uma lista do tipo [1,2,3]
      const sectionRow = document.createElement("tr");
      sectionRow.id =`row-${type}-tr`;

      for(const item of list){
        const itemn = formatInventoryNumber(String(item))
        const sectionCell = document.createElement(`${type_cell}`)
        sectionCell.id =`row-${type}-${item}-th`;
        sectionCell.textContent = `${itemn}`;
        
        sectionRow.appendChild(sectionCell);
      }
      return sectionRow
    }
  
    const tableTituloLinha = populateElements(type, list, type_cell);
    return tableTituloLinha

}

export default createTableTituloLinha;