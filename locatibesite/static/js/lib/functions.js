export async function fetchData(json) {
    try {
        const response = await fetch(json);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export function getPathFromPointers(data, pointers, keysToSearch) {
    const resultsList = [];

    for (const pointer of pointers) {
        const pointerPath = pointer.path;
        let path = "";
        let lastKey = "";

        if (pointerPath === "No Path") {
            const results = searchKeysInJson(data, keysToSearch);

            // Use spread operator to push each item inside 'results' to 'resultsList'
            resultsList.push(...results);

        } else {
            if (typeof pointerPath === 'string' && pointerPath.trim() !== '') {
                const keys = pointerPath.match(/\w+/g);

                if (keys && keys.length > 0) {
                    let currentData = data;

                    for (let i = 0; i < keys.length; i++) {
                        lastKey = keys[i];
                        currentData = currentData[lastKey];
                    }

                    path = currentData;
                }
            } else {
                path = data;
            }

            resultsList.push({ path, lastKey });
        }
    }
    return resultsList;
}

function searchKeysInJson(data, keysToSearch) {
    const results = [];

    function recursiveSearch(currentData, currentPath = '') {
        for (const key in currentData) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;

            if (keysToSearch.includes(key)) {
                let lastKey = '';
                let path = data;

                const pathSegments = currentPath.split('.');
                if (pathSegments == '') {
                    lastKey = '';
                    path = data;
                } else {
                    lastKey = pathSegments[pathSegments.length - 1];
                    path = data;
                    pathSegments.forEach(segment => {
                        path[segment] = path[segment] || {};
                        path = path[segment];
                    })
                }

                results.push({ path, lastKey });
            }

            if (typeof currentData[key] === 'object') {
                recursiveSearch(currentData[key], newPath);
            }
        }
    }
    recursiveSearch(data);

    return results;
}


export function updateValue(instance, name, newValue) {
    let json = instance.getAttribute('json')
    let css = instance.getAttribute('css')
    let pointers = JSON.parse(instance.getAttribute('pointers').replace(/'/g, '"'))
    let pattern = instance.getAttribute('pattern')
    let componentID = instance.getAttribute('id')

    //console.log("name:", name);
    //console.log("newValue:", newValue);
    //console.log("json:", json);
    //console.log("css:", css);
    //console.log("pointers:", pointers);
    //console.log("pattern:", pattern);
    //console.log("componentID:", componentID);

    switch (name) {
        case "json":
            json = newValue;
            break;
        case "css":
            css = newValue;
            break;
        case "pointers":
            pointers = JSON.parse(newValue.replace(/'/g, '"'));
            break;
        case "pattern":
            pattern = newValue;
            break;
        case "id":
            componentID = newValue;
            break;
    }

    if (isValidJsonString(json)) {
        try {
            const data = JSON.parse(json);
            instance.populateElements(data, css, pointers, pattern, componentID);
        } catch (error) {
            instance.handleError(error);
        }
    } else {
        fetchData(json)
            .then(data => instance.populateElements(data, css, pointers, pattern, componentID))
            .catch(error => instance.handleError(error));
    }
}



export function windowSize(instance) {
    const windowWidth = window.innerWidth;
    pattern = instance.getAttribute("pattern");

    // Adjust attributes based on screen width
    if (windowWidth < 900) {
        if (pattern != "1") {
            instance.clearMapElements();
            instance.setAttribute("pattern", "1");
        }
        if (pattern == null) {
            instance.setAttribute("pattern", "1");
        }
    } else if (windowWidth => 900) {
        if (pattern != "1") {
            instance.clearMapElements();
            instance.setAttribute("pattern", "2");
        }
        if (pattern == null) {
            instance.setAttribute("pattern", "2");
        }
    }
}



export function extractSubstring(string, prefix) {
    if (string.startsWith(prefix)) {
        let result = string.substring(prefix.length);
        if (result.endsWith("s")) {
            result = result.slice(0, -1); // Remove the last character
        }
        return result;
    }
    return string;
}



export function isValidJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}