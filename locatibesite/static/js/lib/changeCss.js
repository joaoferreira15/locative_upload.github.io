function changeCssAttribute(elementId, newCssValue) {
    const targetElement = document.getElementById(elementId);

    if (targetElement) {
        targetElement.setAttribute('css', newCssValue);
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}

function createCssAttribute(elementId, newCssValue) {
    const targetElement = document.getElementById(elementId);
    // Open the development environment with the specified CSS file
    const developmentPageUrl = `develop.html?filePath=${newCssValue}`;
    const newPage = window.open(developmentPageUrl, '_blank');

    if (newPage) {
        // Check for the existence of the specific localStorage or sessionStorage item
        const checkItemInterval = setInterval(() => {
            const storedCSS = localStorage.getItem(`customCSS-${newCssValue}`) || sessionStorage.getItem(`customCSS-${newCssValue}`);
            if (storedCSS) {
                clearInterval(checkItemInterval); // Stop checking once the item is found
                // Proceed with the rest of the code after the item is set
                if (targetElement) {
                    targetElement.setAttribute('css', storedCSS);
                } else {
                    console.error(`Element with ID '${elementId}' not found.`);
                }
            }
        }, 100); // Check every 100 milliseconds
    } else {
        console.error('Failed to open the development page.');
    }
}







function applyCSS(storageType) {
    var cssCode = document.getElementById("code-editor").value;
    var cssFilePath = getQueryParam('filepath');
    storeCSS(cssFilePath, storageType, cssCode);
}

function getQueryParam(name) {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    // Return the value of the specified query parameter
    return urlParams.get(name);
}

function storeCSS(cssFilePath, storageType, cssCode) {
    if (storageType === 'localStorage') {
        localStorage.setItem(`customCSS-${cssFilePath}`, cssCode);
    } else if (storageType === 'sessionStorage') {
        sessionStorage.setItem(`customCSS-${cssFilePath}`, cssCode);
    }
}

function applyStoredCSS() {
    var storedCSS = localStorage.getItem('customCSS') || sessionStorage.getItem('customCSS');
    if (storedCSS) {
        var styleTag = document.createElement("style");
        styleTag.innerHTML = storedCSS;
        document.head.appendChild(styleTag);
    }
}
