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
        // Listen for message from the child window
        window.addEventListener('message', event => {
            if (event.data && event.data.action === 'saveChangesCompleted') {
                console.log('Message "saveChangesCompleted" received from child window');
                // Proceed with the rest of the code after saveChanges completes in the child window
                if (targetElement) {
                    targetElement.setAttribute('css', "");
                    targetElement.setAttribute('css', newCssValue);
                } else {
                    console.error(`Element with ID '${elementId}' not found.`);
                }
            }
        });
    } else {
        console.error('Failed to open the development page.');
    }
}




function saveChanges() {
    const newCssValue = document.getElementById('code-editor').value;
    
    // Send the updated CSS content and file path to the server using AJAX
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Changes saved successfully!');
            } else {
                console.error('Failed to save changes:', xhr.statusText);
            }
        }
    };

    // Replace 'save_css.php' with the server-side script or endpoint for saving the changes
    const urlParams = new URLSearchParams(window.location.search);
    const cssFilePath = urlParams.get('filePath');

    // Construct the parameters to be sent to the server
    const params = 'cssFilePath=' + encodeURIComponent(cssFilePath) + '&cssContent=' + encodeURIComponent(newCssValue);

    xhr.open('POST', "http://localhost:5000/update-css", true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    
    // Close the window or navigate back to the main page
    window.opener.postMessage({ action: 'saveChangesCompleted' }, '*');
    //window.close();
}


function loadCssFile(filePath) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('code-editor').value = xhr.responseText;
        }
    };
    xhr.open('GET', filePath, true);
    xhr.send();
}

// Execute the function when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get the CSS file path from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cssFilePath = urlParams.get('filePath');

    // Load the CSS file content into the code editor
    if (cssFilePath) {
        loadCssFile(cssFilePath);
    }
});

