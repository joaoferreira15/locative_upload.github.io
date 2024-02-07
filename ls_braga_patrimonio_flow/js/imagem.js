function createImagem(type, key, value) {
        
    function formatInventoryNumber(input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2')
                  .replace(/^./, function(str) { return str.toUpperCase(); });
    }



    function populateElements(type, key, value) {
      const row = document.createElement("img");
      row.id = `${type}_${key}_image`
      if (key == "logo"){
        row.classList.add("logo")
      } else {
        row.classList.add("imagem")
      }
      row.src = value;

      return row
    }

    const imagem = populateElements(type, key, value);
    return imagem
}

export default createImagem;