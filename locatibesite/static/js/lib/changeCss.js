function changeAttribute(elementId, newValue) {
    const targetElement = document.getElementById(elementId);

    if (targetElement) {
        targetElement.setAttribute('css', newValue);
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

//FileType should be "css" or "json"
function createCustomAttribute(elementId, newValue, fileType) {
    const targetElement = document.getElementById(elementId);
    // Open the development environment with the specified CSS file
    const developmentPageUrl = `https://joaoferreira15.github.io/locative_upload.github.io/locatibesite/develop.html?filePath=${newValue}&elementId=${elementId}&fileType=${fileType}`;
    const newPage = window.open(developmentPageUrl, '_blank');
    //console.log(newValue)

    if (newPage) {
        if (targetElement) {
            // Get the initial value from localStorage
            let previousValue = localStorage.getItem(`custom-${fileType}-${elementId}`);
            // Function to check for changes in localStorage value
            const checkForChanges = () => {
                // Get the current value from localStorage
                const currentValue = localStorage.getItem(`custom-${fileType}-${elementId}`);
                if (currentValue !== previousValue) {
                    //console.log("Value changed:", currentValue);

                    const customType = extractFileType(`custom-${fileType}-${elementId}`)
                    //console.log("customType", customType)

                    if (customType === "css") {
                        targetElement.setAttribute('css', currentValue);
                    } else if (customType === "json") { 
                        const targetJsonElement = document.getElementById(`json-${elementId}`);
                        targetElement.setAttribute('json', currentValue);
                        targetJsonElement.setAttribute('json', currentValue)
                    }

                    previousValue = currentValue;
                }

                // Call the function recursively
                setTimeout(checkForChanges, 1000); // Check every second
            };

            // Start checking for changes
            checkForChanges();
        }
    }
}

function extractFileType(inputString) {
    const parts = inputString.split("-");
    return parts.length >= 3 ? parts[1] : null;
}

function applyCustom(storageType) {
    var code = document.getElementById("code-editor").value;
    var elementId = getQueryParam('elementId');
    var fileType = getQueryParam('fileType');

    storeCustom(elementId, storageType, code, fileType);
    if (window.getComputedStyle(document.getElementById('load-template-btn')).display === 'none') {
        document.getElementById('load-template-btn').style.display = 'block';
    }
}

function getQueryParam(name) {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    // Return the value of the specified query parameter
    return urlParams.get(name);
}

function storeCustom(elementId, storageType, code, fileType) {
    if (storageType === 'localStorage') {
        localStorage.setItem(`custom-${fileType}-${elementId}`, code);
        //console.log("funcionou")

    } else if (storageType === 'sessionStorage') {
        sessionStorage.setItem(`custom-${fileType}-${elementId}`, code);
        //console.log("funcionou")
    }
}

function loadFile(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('code-editor').value = xhr.responseText;
        }
    };
    xhr.open('GET', filePath, true);
    xhr.send();
}

function loadTemplate() {
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get('filePath');

    loadFile(filePath)
    console.log("Loaded")
}

// Execute the function when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the CSS file path from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const filePath = urlParams.get('filePath');
    var fileType = urlParams.get('fileType');
    var elementId = urlParams.get('elementId');

    const customtValue = localStorage.getItem(`custom-${fileType}-${elementId}`);
    //console.log("customtValue", customtValue)
    // Load the CSS file content into the code editor
    if (customtValue) {
        console.log("custom")
        document.getElementById('code-editor').value = customtValue
        if (window.getComputedStyle(document.getElementById('load-template-btn')).display === 'none') {
            document.getElementById('load-template-btn').style.display = 'block';
        }
    } else if (filePath) {
        console.log("filPath")
        loadFile(filePath);
    }
});