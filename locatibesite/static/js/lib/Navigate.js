function navigateToPage(buttonId) {
  const button = document.getElementById(buttonId);

  const json = button.getAttribute('json');
  const pointers = JSON.parse(button.getAttribute('pointers'));

  fetch(json)
    .then(response => response.json())
    .then(data => {
      const path = extractPath(data, pointers) 
      window.location.href = `${path.filename}.html`;
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

function navigateToPage2(filename) {
      window.location.href = `${filename}.html`;

}

// Function to extract coordinates based on pointers
function extractPath(data, pointers) {
  // Access the nested structure using the parts
  let path = "";
  let lastKey = "";

  const pointerPath = pointers[0].path;

  if (typeof pointerPath === 'string') {
    // Use uma expressão regular para encontrar todas as ocorrências de texto entre colchetes
    const keys = pointerPath.match(/\w+/g);

    if (keys && keys.length > 0) {
      let currentData = data;

      for (let i = 0; i < keys.length; i++) {
        lastKey = keys[i];
        currentData = currentData[lastKey];
      }

      path = currentData;
    }
  }

  return path;
}



function navigateToMarker(pageName, mapID) {
  // Dispatch a custom event with the 'name' property
  const event = new CustomEvent("navigateToMarkerEvent", {
      detail: {
          name: pageName,
          id: mapID
      }
  });

  // Dispatch the event to the document
  document.dispatchEvent(event);

  // Scroll to the map component
  const mapElement = document.getElementById(mapID);
  if (mapElement) {
      mapElement.scrollIntoView({
          behavior: 'smooth'
      });
  } else {
      console.error(`Map element with ID ${mapID} not found.`);
  }
}

