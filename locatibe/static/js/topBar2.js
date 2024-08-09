import { fetchData } from "./lib/functions.js";

class TopBarComponent extends HTMLElement {
    constructor(items = null, title = null, text = null, css = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.subtitle = null;
        this.sectionMemo = null;
        this.notAllowedIds = ['page-structure', 'about-section', 'page-highlight-section'];

        this.top = document.querySelector("nav-bar-component") ? document.querySelector("nav-bar-component").shadowRoot.querySelector("nav").getBoundingClientRect().bottom :
            document.querySelector("nav") ? document.querySelector("nav").getBoundingClientRect().bottom :
                this.shadowRoot.querySelector("#header-container") ? this.shadowRoot.querySelector("#header-container").getBoundingClientRect().bottom : 0

        const styleValue = `
            #sectionsIdentification a {
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

            #topBar {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                background-color: white;
            }

            #sectionBar {
                background-color: white;
                position: fixed;
                text-align: center;
                z-index: 5;
                width: 100%;
                top: ${this.top}px;
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
            }`

        if (css != null || this.getAttribute("css") != null) {
            this.cssPath = domainURL ? domainURL : this.getAttribute("css");
        } else { this.cssPath = styleValue }

        const styleElement = shadowRoot.querySelector("style")

        if (this.cssPath) {
            if (/^(http|https):\/\/[^\s]+\.[^\s]+$/.test(this.cssPath)) {
                fetchData(this.cssPath).then(response => styleElement.textContent = response);
            }

            else if (this.cssPath.startsWith('static/')) {
                fetchData(`${this.cssPath}`).then(response => styleElement.textContent = response);
            }

            else {
                styleElement.textContent = this.cssPath;
            }
        } else { styleElement.textContent = styleValue; }

        if (title != null || this.getAttribute("title") != null) {
            const titleValue = title ? title : this.getAttribute("title");
            this.createheader("header-container", "topBar");
            this.addTitle("header-container", titleValue);
        }

        if (text != null || this.getAttribute("text") != null) {
            const textValue = text ? text : this.getAttribute("text");
            if (!shadowRoot.querySelector("#header-container")) { this.createheader("header-container", "topBar"); }
            this.addText("header-container", textValue);
        }

        if (items == null) {
            this.items = Array.from(this.children)
            //console.log(this.items)
        }

        if (this.items) {
            if (!shadowRoot.querySelector("#header-container")) { this.createheader("header-container", "topBar"); }
            this.populateHeader(this.items)
        }

        const headerContainer = shadowRoot.querySelector("#topBar > #header-container");
        if (headerContainer) {
            headerContainer.style.marginTop = `${document.querySelector("nav-bar-component").shadowRoot.querySelector("nav").getBoundingClientRect().bottom}px`
        }

        window.addEventListener('scroll', () => this.updateTopBar());
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style></style>
            <div id="topBar" class="topBar">
                <div id="sectionBar">
                    <div id="sectionsIdentification"></div>    
                </div>
            </div>
        `

        return template
    }

    createheader(headerId, parentId) {
        const section = this.shadowRoot.querySelector(`#${parentId}`);

        const exisitingHeader = section.querySelector(`#${headerId}`)
        if (exisitingHeader) { exisitingHeader.remove() }

        const header = document.createElement("div")
        header.setAttribute("id", `${headerId}`)

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

    addTitle(elementId, titleValue) {
        const header = this.shadowRoot.querySelector(`#${elementId}`);
        const existingTitle = header.querySelector("h1");
        if (existingTitle) { existingTitle.textContent = titleValue; }
        else {
            const title = document.createElement("h1");
            title.textContent = titleValue
            header.appendChild(title);
        }
    }

    addText(elementId, textValue) {
        const header = this.shadowRoot.querySelector(`#${elementId}`);
        const existingTitle = header.querySelector("p");
        if (existingTitle) { existingTitle.textContent = textValue; }
        else {
            const title = document.createElement("p");
            title.textContent = textValue
            header.appendChild(title);
        }
    }

    updateTopBar() {
        const topBar = this.shadowRoot.querySelector('#topBar');
        const sectionBar = this.shadowRoot.querySelector('#sectionBar');

        if (this.isElementOutOfView(this.top, topBar.querySelector('#header-container'))) {
            const sectionsAll = Array.from(document.querySelectorAll('section')).filter(section => !this.notAllowedIds.includes(section.id));
            const firstSectionRect = sectionsAll[0].getBoundingClientRect();
            const sectionBar = topBar.querySelector('#sectionBar')
            let smallContext = sectionBar.querySelector("#smallContext") ? sectionBar.querySelector("#smallContext") : null

            if (!smallContext && this.items) {
                smallContext = document.createElement("div");
                smallContext.id = "smallContext";
                sectionBar.appendChild(smallContext);
            }

            if (firstSectionRect.top <= this.top) {
                const tituloComponent = this.findTituloComponent(topBar.querySelector('#header-container > #content'));

                if (tituloComponent) {
                    const clonedTituloComponent = tituloComponent.cloneNode(true);
                    clonedTituloComponent.style.fontSize = "30px";

                    if (!smallContext.hasChildNodes()) {
                        smallContext.appendChild(clonedTituloComponent);
                    } else if (smallContext.firstChild.textContent !== clonedTituloComponent.textContent) {
                        smallContext.replaceChild(clonedTituloComponent, smallContext.firstChild);
                    }
                }

            } else {
                const childElements = topBar.querySelector("#sectionsIdentification").children;
                for (let i = 0; i < childElements.length; i++) {
                    this.shadowRoot.getElementById("sectionsIdentification").removeChild(childElements[i]);
                }
                if (smallContext) {
                    smallContext.remove();
                }

                this.subtitle = null;
            }

            const trueTop = this.shadowRoot.querySelector("#smallContext") ? this.shadowRoot.querySelector("#smallContext").getBoundingClientRect().bottom : this.top
            console.log(trueTop)
            const sections = this.getTopSectionInView(trueTop);
            console.log("sections", sections)
            const sectionDiv = topBar.querySelector("#sectionBar > #sectionsIdentification");

            if (!sections) {
                sectionDiv.innerHTML = ""
                this.sectionMemo = []
            }

            if (sections) {
                if (!this.arraysAreEqual(sections, this.sectionMemo)) {
                    if (sectionDiv) {
                        sectionDiv.innerHTML = "";
                    };
                    this.subtitle = null;

                    sections.forEach((section, index) => {
                        const rect = section.getBoundingClientRect();
                        const subtitleContent = section.getAttribute("name");
                        const divs = section.querySelectorAll('section');
                        if (rect.top <= trueTop) {
                            if (this.subtitle == null) {
                                this.subtitle = this.createElement(section, `TopBarSectionTitle${index}`, subtitleContent, trueTop);
                            } else {
                                this.subtitle = this.updateElement(section, `TopBarSectionTitle${index}`, subtitleContent);
                            }

                            divs.forEach(div => {
                                const divID = div.getAttribute("id")
                                const rectDiv = div.getBoundingClientRect();
                                const subSubtitleContent = div.getAttribute("name") ? div.getAttribute("name") : div.getAttribute("id")

                                if (rectDiv.top <= trueTop) {
                                    if (this.subtitle == null) {
                                        this.subtitle = this.createElement(div, `TopBarSectionTitle${index}`, subSubtitleContent, trueTop);
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
            }

            const startpoint = this.shadowRoot.querySelector("#sectionsIdentification") ? this.shadowRoot.querySelector("#sectionsIdentification").getBoundingClientRect().top : 0
            const endpoint = this.shadowRoot.querySelector("#smallContext > a") ? this.shadowRoot.querySelector("#smallContext > a").getBoundingClientRect().bottom : 0
            this.shadowRoot.querySelector("#sectionBar").style.height = `${startpoint - endpoint}px`
        } else {
            const childElements = sectionBar.querySelector("#sectionsIdentification").children;
            const smallContext = sectionBar.querySelector("#smallContext")
            for (let i = 0; i < childElements.length; i++) {
                this.shadowRoot.getElementById("sectionsIdentification").removeChild(childElements[i]);
            }
            if (smallContext) smallContext.remove();

            sectionBar.style.height = "0px"

            this.subtitle = null;
            this.sectionMemo = [];
        }
    }

    createElement(div, id, textContent, topPosition) {
        let element = document.createElement("a");

        const divID = div.getAttribute("id");
        const left = div.getBoundingClientRect().left
        const width = div.getBoundingClientRect().width

        const styles = {
            position: 'fixed',
            top: `${topPosition}px`,
            left: `${left}px`,
            width: `${width - 22}px`,
            border: "1px solid black",
        };

        this.newElement(element, divID);

        element.setAttribute("id", id);
        element.textContent = textContent;
        element.classList.add('animated'); // Add animated class
        for (let prop in styles) {
            element.style[prop] = styles[prop];
        }
        this.shadowRoot.getElementById('sectionsIdentification').appendChild(element);
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

    getTopSectionInView(top) {
        var sections = document.querySelectorAll('section')
        sections = Array.from(sections).filter(section => !this.notAllowedIds.includes(section.id));

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
        if (element.tagName && ["h2", "h1", "h3"].includes(element.tagName.toLowerCase())) {
            return element;
        }

        // If the element has shadow DOM, traverse it
        if (element.shadowRoot) {
            const foundInShadow = this.findTituloComponent(element.shadowRoot);
            if (foundInShadow) {
                return foundInShadow;
            }
        }

        // Recursively traverse child nodes
        for (let i = 0; i < element.childNodes.length; i++) {
            const childNode = element.childNodes[i];
            if (childNode.nodeType === Node.ELEMENT_NODE) {
                const foundInChild = this.findTituloComponent(childNode);
                if (foundInChild) {
                    return foundInChild;
                }
            }
        }

        // If not found, return null
        return null;
    }

    isElementOutOfView(topPosition, element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const outOfView = (
            rect.top >= windowHeight ||
            rect.bottom <= topPosition ||
            rect.left >= windowWidth ||
            rect.right <= 0
        );

        return outOfView;
    }
}

customElements.define('top-bar-component', TopBarComponent);
