function createDescription(type, key, value, classV) {

  function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
  }



  function populateElements(type, key, value, classV) {
      const div = document.createElement("div")

      if (key != "") {
        const title = document.createElement("h4");
        title.textContent = "Description";
        title.classList.add("centrado");

        div.appendChild(title)
      }

      const row = document.createElement("p");
      row.id = `${type}_${key}`;
      row.classList.add("centrado", "paddingL");
      if (classV != ""){ 
        row.classList.add(classV);
      }
      row.textContent = `${value}`;

      div.appendChild(row)

      return div
  }

  const description = populateElements(type, key, value, classV);
  return description

}

export default createDescription;
