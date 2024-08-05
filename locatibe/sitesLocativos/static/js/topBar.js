class TopBarComponent extends HTMLElement {
    constructor(items = null, title = null, text = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.subtitle = null;
        this.sectionMemo = null;
        this.notAllowedIds = ['page-structure', 'about-section', 'page-highlight-section'];

        if (title != null || this.getAttribute("title") != null) {
            const titleValue = title ? title : this.getAttribute("title");
            this.createheader();
            this.addTitle(titleValue);
        }

        if (text != null || this.getAttribute("text") != null) {
            const textValue = text ? text : this.getAttribute("text");
            if (!shadowRoot.querySelector("#header-container")) { this.createheader(); }
            this.addText(textValue);
        }

        if (items == null) {
            this.items = Array.from(this.children)
            //console.log(this.items)
        }

        if (this.items) {
            if (!shadowRoot.querySelector("#header-container")) { this.createheader(); }
            this.populateHeader(this.items)
        }

        window.addEventListener('scroll', () => this.updateTopBar());
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            #topBar a {
                text-decoration: none;
                font-weight: bold;
                padding-top: 15px;
                padding-bottom: 15px;
                font-size: 24px;
                width: 80%;
                text-align: left;
                padding-left: 20px;
                background-color: #ECECEC;
                color: black;
                border: 1px solid black;
                border-radius: 12px 12px 0 0;
            }
    
            #sectionBar {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                background-color: white;
            }

                .topBar {
                    position: fixed;
                    text-align: center;
                    z-index: 5;
                    width: 100%;
                    top: 74px;
                    left: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .hidden {
                    display: none
                }
        
                .topBar h1 {
                    margin: 10px;
                    font-size: 40px;
                }
        
                .topBar p {
                    margin: 10px;
                    font-size: 26px;
                    width: 60%;
                    color: white;
                }
        
                #topBar-title {
                    width: 100%;
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    background: #333;
                }

                .animated {
                    transition: opacity 0.5s ease, transform 0.5s ease;
                    opacity: 0;
                    transform: translateY(20px);
                }
        
                .animated.show {
                    opacity: 1;
                    transform: translateY(0);
                }
            </style>
            <div class="topBar" id="topBar">
                <div id="sectionBar"></div>
            </div>
        `

        return template
    }



    createheader() {
        const section = this.shadowRoot.querySelector("#topBar");

        const exisitingHeader = section.querySelector("#header-container")
        if (exisitingHeader) { exisitingHeader.remove() }

        const header = document.createElement("div")
        header.setAttribute("id", "header-container")

        const childElements = Array.from(section.children);
        childElements.unshift(header)

        section.innerHTML = "";
        childElements.forEach(child => {
            section.appendChild(child);
        });
    }

    populateHeader(items) {
        const header = this.shadowRoot.querySelector("#header-container");
        var existingContent = header.querySelector("#content");
        if (existingContent) {
            existingContent.innerHTML = "";
            items.forEach(item => {
                existingContent.appendChild(item)
            })
            header.appendChild()
        } else {
            existingContent = document.createElement("div")
            existingContent.id = "content"
        }

        items.forEach(item => {
            existingContent.appendChild(item)
        })
        header.appendChild(existingContent)
    }

    addTitle(titleValue) {
        const header = this.shadowRoot.querySelector("#header-container");
        const existingTitle = header.querySelector("h1");
        if (existingTitle) { existingTitle.textContent = titleValue; }
        else {
            const title = document.createElement("h1");
            title.textContent = titleValue
            header.appendChild(title);
        }
    }

    addText(textValue) {
        const header = this.shadowRoot.querySelector("#header-container");
        const existingTitle = header.querySelector("p");
        if (existingTitle) { existingTitle.textContent = textValue; }
        else {
            const title = document.createElement("p");
            title.textContent = textValue
            header.appendChild(title);
        }
    }



    updateTopBar() {
        const sections = this.getTopSectionInView();

        const topBar = this.shadowRoot.querySelector('#topBar');
        const top = this.shadowRoot.querySelector("#header-container") ? this.shadowRoot.querySelector("#header-container").getBoundingClientRect().bottom :
            document.querySelector("nav-bar-component") ? document.querySelector("nav-bar-component").shadowRoot.querySelector("nav").getBoundingClientRect().bottom :
                document.querySelector("nav") ? document.querySelector("nav").getBoundingClientRect().bottom : 0
        const sectionDiv = this.shadowRoot.querySelector("#sectionBar");
        if (sections.length == 0) {
            while (sectionDiv.children.length > 0) {
                sectionDiv.removeChild(sectionDiv.children[0]);
            }
            this.sectionMemo = []
        }

        if (sections.length > 0) {
            if (!this.arraysAreEqual(sections, this.sectionMemo)) {
                //console.log("1 sections", sections, "1 sectionMemo", this.sectionMemo)
                if (sectionDiv) {
                    while (sectionDiv.children.length > 0) {
                        sectionDiv.removeChild(sectionDiv.children[0]);
                    }
                };
                this.subtitle = null;

                sections.forEach((section, index) => {
                    //console.log("2 section", section, index)
                    const sectionID = section.getAttribute("id");
                    const rect = section.getBoundingClientRect();
                    const subtitleContent = section.getAttribute("name");
                    const divs = section.querySelectorAll('section');
                    //console.log("3 dimensions", rect.top, topBar.offsetHeight)
                    if (rect.top <= top) {
                        //console.log("4 dimensions", rect.top, topBar.offsetHeight)
                        if (this.subtitle == null) {
                            this.subtitle = this.createElement(section, `TopBarSectionTitle${index}`, subtitleContent);
                        } else {
                            this.subtitle = this.updateElement(section, `TopBarSectionTitle${index}`, subtitleContent);
                        }

                        divs.forEach(div => {
                            const divID = div.getAttribute("id")
                            const rectDiv = div.getBoundingClientRect();
                            const subSubtitleContent = div.getAttribute("name") ? div.getAttribute("name") : div.getAttribute("id")

                            if (rectDiv.top <= top) {
                                if (this.subtitle == null) {
                                    this.subtitle = this.createElement(div, `TopBarSectionTitle${index}`, subSubtitleContent);
                                } else {
                                    this.subtitle = this.updateElement(div, `TopBarSectionTitle${index}`, subSubtitleContent);
                                }
                            }
                        });
                    } else {
                        const elementToRemove = this.shadowRoot.getElementById(`TopBarSectionTitle${index}`)
                        if (elementToRemove) {
                            elementToRemove.parentNode.removeChild(elementToRemove);
                            this.subtitle = null
                        }
                    }
                    this.subtitle = null
                });
                this.sectionMemo = sections
            }

            var sectionsAll = document.querySelectorAll('section');
            sectionsAll = Array.from(sections).filter(section => !this.notAllowedIds.includes(section.id));
            const firstSectionRect = sectionsAll[0].getBoundingClientRect();

            if (topBar.querySelector('#header-container')) {
                if (firstSectionRect.top <= top) {
                    //console.log(true)
                    if (topBar.querySelector('#header-container > h1')) {
                        topBar.querySelector('#header-container > h1').style.fontSize = '40px';

                        const children = topBar.querySelector('#header-container').children
                        children.forEach(child => {
                            child.classList.add("hidden")
                        })
                    }
                    if (topBar.querySelector('#header-container > p')) {
                        topBar.querySelector('#header-container > p').classList.add("hidden");
                    } else if (topBar.querySelector('#header-container > #content')) {
                        //titulo-component
                        const tituloComponent = this.findTituloComponent(topBar.querySelector('#header-container > #content')).cloneNode(true);

                        const children = Array.from(topBar.querySelector('#header-container').children)
                        children.forEach(child => {
                            child.classList.add("hidden")
                        })
                        tituloComponent.style.fontSize = "32px"
                        tituloComponent.classList.remove("hidden")
                        topBar.querySelector('#header-container').appendChild(tituloComponent)


                    }
                } else {
                    //console.log(false)
                    const childElements = this.shadowRoot.getElementById("sectionBar").children;
                    for (let i = 0; i < childElements.length; i++) {
                        this.shadowRoot.getElementById("sectionBar").removeChild(childElements[i]);
                    }
                    this.subtitle = null;
                    //subSubtitle = null;
                    topBar.querySelector('#header-container > h1').style.fontSize = '50px';
                    const children = topBar.querySelector('#header-container').children
                    children.forEach(child => {
                        child.classList.remove("hidden")
                    })
                    topBar.querySelector('#header-container > titulo-component').remove()
                }
            }
        }
    }

    createElement(div, id, textContent) {
        let element = document.createElement("a");
        const top = this.shadowRoot.querySelector("#header-container") ? this.shadowRoot.querySelector("#header-container").getBoundingClientRect().bottom :
            document.querySelector("nav-bar-component") ? document.querySelector("nav-bar-component").shadowRoot.querySelector("nav").getBoundingClientRect().bottom :
                document.querySelector("nav") ? document.querySelector("nav").getBoundingClientRect().bottom : 0

        const divID = div.getAttribute("id");
        const left = div.getBoundingClientRect().left
        const width = div.getBoundingClientRect().width

        const styles = {
            position: 'fixed',
            top: top,
            left: left,
            width: width - 22,
            border: "1px solid black",
        };

        this.newElement(element, divID);

        element.setAttribute("id", id);
        element.textContent = textContent;
        element.classList.add('animated'); // Add animated class
        for (let prop in styles) {
            element.style[prop] = styles[prop];
        }
        this.shadowRoot.getElementById('sectionBar').appendChild(element);
        setTimeout(() => {
            element.classList.add('show'); // Add show class after a short delay
        }, 10);

        return element;
    }

    updateElement(div, id, textContent) {
        const existingElement = this.shadowRoot.getElementById(id);
        const divID = div.getAttribute("id");

        existingElement.setAttribute("id", id);
        existingElement.textContent = textContent;
        this.newElement(existingElement, divID);

        return existingElement
    }

    newElement(element, divID) {
        const sectionTop = document.getElementById(divID).getBoundingClientRect().top + window.scrollY;
        const offsetTop = Math.max(sectionTop - 200, 0);

        // Set the href to scroll to the calculated offsetTop
        element.addEventListener('click', function (event) {
            event.preventDefault();
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    }



    getTopSectionInView() {
        var sections = document.querySelectorAll('section')
        sections = Array.from(sections).filter(section => !this.notAllowedIds.includes(section.id));

        //const topBar = this.shadowRoot.querySelector('#topBar');
        const top = this.shadowRoot.querySelector("#header-container") ? this.shadowRoot.querySelector("#header-container").getBoundingClientRect().bottom :
            document.querySelector("nav-bar-component") ? document.querySelector("nav-bar-component").shadowRoot.querySelector("nav").getBoundingClientRect().bottom :
                document.querySelector("nav") ? document.querySelector("nav").getBoundingClientRect().bottom : 0
        let topSection = [];
        let topSectionRectBottom = +Infinity;
        let topSectionRectTop = null;

        // Find the section at the top of the viewport
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (rect.top == topSectionRectTop) {
                topSection.push(section)
            }

            if (rect.bottom >= top && rect.bottom <= topSectionRectBottom && rect.top < top) {
                topSection = [section];
                topSectionRectBottom = rect.bottom;
                topSectionRectTop = rect.top;
            }
        });
        //console.log("top", top)
        console.log("topSections", topSection)
        return topSection;
    }



    arraysAreEqual(array1, array2) {
        if (array1 == null || array2 == null) {
            return false
        }
        // Check if arrays are of equal length
        if (array1.length != array2.length) {
            return false;
        }

        // Check each element of the arrays
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }

        // If all elements are equal, arrays are equal
        return true;
    }



    findTituloComponent(element) {
        // Check if the current element matches the criteria
        if (element.tagName && element.tagName.toLowerCase() == 'titulo-component') {
            return element;
        }

        // If the element has shadow DOM, traverse it
        if (element.shadowRoot) {
            console.log("element.shadowRoot", element.shadowRoot)
            const foundInShadow = this.findTituloComponentInShadow(element.shadowRoot);
            if (foundInShadow) {
                return foundInShadow;
            }
        }

        // Recursively traverse child nodes
        for (let i = 0; i < element.childNodes.length; i++) {
            const childNode = element.childNodes[i];
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const foundInChildren = this.findTituloComponent(childNode);
                if (foundInChildren) {
                    return foundInChildren;
                }
            }
        }

        // If not found, return null
        return null;
    }

    // Helper function to search for titulo-component within Shadow DOM
    findTituloComponentInShadow(shadowRoot) {
        const foundInShadow = shadowRoot.querySelector('titulo-component');
        return foundInShadow;
    }
}

customElements.define('top-bar-component', TopBarComponent);
