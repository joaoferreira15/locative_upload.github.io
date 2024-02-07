function createSubTitlo(type, key, value) {

    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }


    function populateElements(type, key, value) {
        const keyn = formatInventoryNumber(key)

        const row = document.createElement("h3");
        row.id = `${type}_${key}`
        row.classList.add("centrado")
        if (key == ""){
            row.textContent = `${value}`;
        } else {
            row.textContent = `${keyn}: ${value}`;
        }
        return row
    }

    const SubTitlo = populateElements(type, key, value);
    return SubTitlo
}

export default createSubTitlo;