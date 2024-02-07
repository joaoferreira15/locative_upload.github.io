function createTableRegistoLinha(type, list, type_cell) {
  
    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }


    function populateElements(type, list, type_cell) {
      // fetch de uma lista do tipo [1,2,3]
      const sectionRow = document.createElement("tr");
      sectionRow.id =`row-${type}-tr`;

      for(const item of list){
        const itemn = formatInventoryNumber(item[0])
        const sectionCell = document.createElement(`${type_cell}`)
        sectionCell.id =`row-${type}-${itemn}-th`;
        if (item[0] == "URL"){ 
            const linkElement = document.createElement("a");
            linkElement.textContent = item[1];
            linkElement.href = item[1];
            linkElement.target = "_blank";
            sectionCell.appendChild(linkElement);
        } else {sectionCell.textContent = `${item[1]}`;}
        
        sectionRow.appendChild(sectionCell);
      }
      return sectionRow
     }

     const tableRegistoLinha = populateElements(type, list, type_cell);
     return tableRegistoLinha
}

export default createTableRegistoLinha;