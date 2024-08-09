  function formatInventoryNumber(input) {
    return input.replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, function (str) { return str.toUpperCase(); });
  }

  export function populateTitulo(type, key, value, classV, callback) {
    const keyn = formatInventoryNumber(key);
    const valuen = formatInventoryNumber(value);

      // Create the elements directly
      const row = document.createElement("h2");
      row.id = "titulo-component"
      row.setAttribute("name", `${type}Titulo`);
      if (key == "") {
        row.textContent = `${valuen}`;
      }

      if (value = "") {
        row.textContent = `${keyn}`;
      }

      if (key != "" && value != "") {
        row.textContent = `${keyn}: ${value}`;
      }

      if (classV !== "") {
        if (typeof classV === "string") {
          row.classList.add(classV);
        } else if (Array.isArray(classV)) {
          for (const cls of classV) {
            row.classList.add(cls);
          }
        }
      }
      return row
  }