function createRegisto(type, key, value, classV) {

  function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/^./, function(str) { return str.toUpperCase(); });
  }



  function populateElements(type, key, value, classV) {
    const keyn = formatInventoryNumber(key)

    const row = document.createElement("p");
    row.id = `${type}_${key}`

    if (key == "") {
      row.textContent = `${value}`
    } else {
      row.textContent = `${keyn}: ${value}`
    }

    if (classV != "") {
      row.classList.add(classV)
    }

    return row
  }

  const registo = populateElements(type, key, value, classV);
  return registo

}

export default createRegisto;