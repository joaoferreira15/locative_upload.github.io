function createTitulo(type, key, value, extra = null) {

  function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
  }


  function populateElements(type, key, value, extra) {
      const keyn = formatInventoryNumber(key);
      const valuen = formatInventoryNumber(value);
      

      // Create the elements directly
      const row = document.createElement("h2");
      row.id = `${type}_${key}`;
      if (key == "") {
        row.textContent = `${valuen}`;
      }
      if (value = ""){
        row.textContent = `${keyn}`;
      }
      if (key != "" && value != "") {
        row.textContent = `${keyn}: ${value}`;
      }


      return row;
  }

  const titulo = populateElements(type, key, value);
  return titulo

}

export default createTitulo;
