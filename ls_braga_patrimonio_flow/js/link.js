function createLink(type, key, value) {
   
    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }


    function populateElements(type, key, value) {
        const row = document.createElement("a");
        row.id = `${type}_${key}`
        row.classList.add("centrado")
        if (key == "branco") {
            row.classList.add("branco")
        }
        row.textContent = value
        row.href = value;
        row.target = "_blank";

        return row
    }

    const link = populateElements(type, key, value);
    return link

}

export default createLink;