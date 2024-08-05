class SectionTitle extends HTMLElement {
    constructor(sections = null, title = null, expand = null, redirect = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.expanded = false
        this.memo = []

        // Call methods to initialize the component
        if (sections == null) {
            const children = Array.from(this.parentNode.children).filter(child => child != this)
            //console.log("children", children)
            this.sections = Array.from(children)
        }

        if (title != null || this.getAttribute("title") != null) {
            const titleValue = title ? title : this.getAttribute("title");
            this.createheader();
            this.addTitle(titleValue);
        }

        if (expand == true || this.getAttribute("expand") == "true") {
            this.createButtons();
            this.addButtons("expand");
        }

        if (redirect != null || this.getAttribute("redirect") != null) {
            const redirectValue = redirect ? redirect : this.getAttribute("redirect");
            if (!shadowRoot.querySelector("#header-container > buttons-container")) { this.createButtons(); }
            this.addButtons(redirectValue);
        }
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            .sectionHeader {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                border-bottom: 1px solid black;
            }

            .content {
                padding: 20px;
            }

            .cabeçalho {
                margin-left: 20px;
            }

            #overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                display: none;
                justify-content: center;
                align-items: center;
                
            }
            #overlay-content {
                background: white;
                color: black;
                padding: 20px;
                border-radius: 5px;
            }

            .toggleButton {
                border: 1px solid black;
                border-radius: 5px;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 10px;
                padding-right: 10px;
                margin-right: 20px;
                z-index: 2;
            }
            </style>
            <div id="header-container" class="sectionHeader"></div>
        `

        return template
    }

    createheader() {
        const section = this.shadowRoot.querySelector("#header-container");

        const exisitingHeader = section.querySelector(".cabeçalho")
        if (exisitingHeader) { exisitingHeader.remove() }

        const header = document.createElement("div")
        header.classList.add("cabeçalho")

        const childElements = Array.from(section.children);
        childElements.unshift(header)

        section.innerHTML = "";
        childElements.forEach(child => {
            section.appendChild(child);
        });
    }

    createButtons() {
        const section = this.shadowRoot.querySelector("#header-container");

        const exisitingButtons = section.querySelector("#buttons-container")
        if (exisitingButtons) { exisitingButtons.remove() }

        const buttons = document.createElement("div")
        buttons.setAttribute("id", "buttons-container")

        const childElements = Array.from(section.children);
        childElements.push(buttons)

        section.innerHTML = "";
        childElements.forEach(child => {
            section.appendChild(child);
        });
    }



    addTitle(titleValue) {
        const header = this.shadowRoot.querySelector("#header-container > .cabeçalho");
        const existingTitle = header.querySelector("h2");
        if (existingTitle) { existingTitle.textContent = titleValue; }
        else {
            const title = document.createElement("h2");
            title.textContent = titleValue
            header.appendChild(title);
        }
    }

    addButtons(type) {
        const buttonContainer = this.shadowRoot.querySelector("#header-container > #buttons-container");
        const button = document.createElement("button");
        button.classList.add("toggleButton")

        if (type == "expand") {
            button.textContent = '\u25BC';
            button.setAttribute("id", "expandBtn");
            button.onclick = () => this.toggleDivs(this.sections);
        } else if (type == "new page") {
            button.textContent = 'show more';
            button.setAttribute("id", "newpagetBtn");
            button.onclick = () => this.openChildPage("2.redirectingPage.html", "https://en.wikipedia.org/wiki/Main_Page?m=1", "page", "childpage");
        } else if (type == "redirect") {
            button.textContent = 'show more';
            button.setAttribute("id", "redirectBtn");
            button.onclick = () => this.redirectToURLWithParams("2.redirectingPage.html", "http://localhost:3000/github-proxy", "gallery", "redirect", "Titulo da Galeria");
        } else if (type == "overlay") {
            button.textContent = 'overlay';
            button.setAttribute("id", "overlayBtn");
            button.onclick = () => this.overlayURL("struct30307.html");
        }

        buttonContainer.appendChild(button);
    }

    toggleDivs(divs) {
        const divsWithShadowRoot = [];
        const divsWithoutShadowRoot = [];

        // Separate divs into two lists based on whether they have a shadow root
        divs.forEach(div => {
            if (div.shadowRoot) {
                divsWithShadowRoot.push(div);
            } else {
                divsWithoutShadowRoot.push(div);
            }
        });

        // Call the appropriate function only if the list has items
        if (divsWithoutShadowRoot.length > 0) {
            this.hideDivs(divsWithoutShadowRoot, this.expanded, this.memo);
        }
        if (divsWithShadowRoot.length > 0) {
            this.toogleDivsShadowRoot(divsWithShadowRoot);
        }
    }


    async showOverlay() {
        // Show the overlay div
        const overlay = document.createElement("div") 
        overlay.id = "overlay"
        overlay.style.display = 'flex';
        const overlayContent = document.createElement("div") 
        overlayContent.id = "overlay-content"
        overlay.appendChild(overlayContent)

        // Fetch the HTML content from another page
        try {
            let response = await fetch('pageExemple.html');
            if (response.ok) {
                let htmlContent = await response.text();
                overlayContent.innerHTML = htmlContent;
            } else {
                overlayContent.innerHTML = 'Error loading content';
            }
        } catch (error) {
            overlayContent.innerHTML = 'Error: ' + error.message;
        }

        // Close the overlay when clicking outside the content
        overlay.addEventListener('click', function (event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    }


    hideDivs(divs, expanded, memo) {
        // Show all divs
        console.log("divs", divs, expanded)
        if (!expanded) {
            Array.from(divs).forEach((div, index) => {
                if (!div.classList.contains('hidden')) {
                    memo.push(index);
                } else {
                    setTimeout(() => { // Delay to allow expansion effect
                        div.classList.remove('hidden');
                    }, 50 * index);
                }
            });
            expanded = true;
        } else if (expanded) {
            Array.from(divs).forEach((div, index) => {
                if (!memo.includes(index)) {
                    div.classList.add('hidden');
                }
            });
            memo = []
            expanded = false;
        }
        console.log("expanded", expanded)
        return [expanded, memo];
    }

    toogleDivsShadowRoot(children) {
        console.log("sent")
        children.forEach(child => {
            const event = new CustomEvent('toggleDivsInput', {
                bubbles: true,
                composed: true
            });
            child.dispatchEvent(event);
        });
    }

    /*async toogleDivsShadowRoot(children) {
        const eventPromises = Array.from(children).map(child => {
            return new Promise(resolve => {
                const event = new CustomEvent('toggleDivsInput', {
                    bubbles: true,
                    composed: true
                });
                // Listen for a response event from the child
                child.addEventListener('responseEvent', response => {
                    resolve(response.detail); // Resolve the promise with the response
                    //console.log("response.target", response.target)
                });
                child.dispatchEvent(event);
            });
        });

        // Wait for all events to be dispatched and responses received
        const responses = await Promise.all(eventPromises);
        responses.forEach(response => {
            // Execute a function with the response
            console.log("recebido 2", response)
            const childNodes = response[0];
            const expandedState = response[1];
            const memo = response[2];
            const target = response[3];

            //console.log(childNodes, expandedState, target)
            const [newExpanded, newMemo] = this.hideDivs(childNodes, expandedState, memo);
            console.log("newExpanded, newMemo", newExpanded, newMemo)
            // Dispatch another event to the child with the updated expandedState
            const updatedEvent = new CustomEvent('updatedExpandedState', {
                bubbles: true,
                composed: true,
                detail: [newExpanded, newMemo] // Include the updated expandedState in the detail
            });
            target.dispatchEvent(updatedEvent);
        });
    }*/
}

customElements.define('section-title-component', SectionTitle);
