    export function populateDescription(type, key, value, classV) {
        const div = document.createElement("div")
        div.id = "description-component"

        if (key != "") {
            const title = document.createElement("h4");
            title.textContent = "Description";
            title.classList.add("centrado");

            div.appendChild(title)
        }

        const row = document.createElement("p");
        row.id = `${type}Description`;
        row.classList.add("centrado", "paddingL");
        if (classV !== "") {
            if (typeof classV === "string") {
                row.classList.add(classV);
            } else if (Array.isArray(classV)) {
                for (const cls of classV) {
                    row.classList.add(cls);
                }
            }
        }
        row.textContent = `${value}`;
        div.appendChild(row)

        return div
    }