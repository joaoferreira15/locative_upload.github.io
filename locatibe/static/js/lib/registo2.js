    function formatInventoryNumber(input) {
        return input.replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); });
    }

    export function populateRegisto(type, key, value, classV) {
        const keyn = formatInventoryNumber(key);

        const row = document.createElement("p");
        row.id = "registo-component";
        row.setAttribute("name", `${type}Registo`);

        if (key == "") {
            row.textContent = `${value}`;
        } else {
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

        return row;

    }