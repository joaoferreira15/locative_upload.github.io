class NavBarComponent extends HTMLElement {
    constructor(domainURL = null) {
        super();
        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        if (domainURL != null || this.getAttribute("domainURL") != null) {
            const urlValue = domainURL ? domainURL : this.getAttribute("domainURL");
            shadowRoot.querySelector("#Domain-URL").setAttribute("href", urlValue);
            shadowRoot.querySelector("#Domain-URL").setAttribute("target", "_blank");
        }

        this.pageStructureVisible = false;
        this.pageStructureSection = null
        this.aboutVisible = false;
        this.aboutSection = null

        // Check document DOM for Content sections, pageStructure and about
        const innerMenuItems = this.shadowRoot.querySelector("#innerMenu")
        // Add an event listener for the click event
        innerMenuItems.addEventListener("click", () => {
            this.toggleInnerMenu();
        });

        this.StructureSections()
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
            nav {
                z-index: 4;
            }
    
            .navbar {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                justify-content: space-between;
                align-items: center;
                background-color: #333;
                color: white;
                padding: 10px;
                width: 100%;
                z-index: 1000;
            }
    
            .navbar-left {
                display: flex;
                align-items: center;
            }
    
            .dropdown {
                position: relative;
                display: inline-block;
            }
    
            .dropbtn {
                background-color: transparent;
                color: white;
                border: none;
                cursor: pointer;
            }
    
            .dropdown-content {
                display: block;
                position: absolute;
                background-color: #333;
                min-width: 120px;
                z-index: 1000;
            }
    
            .dropdown-content a {
                color: white;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
                font-size: 20px;
            }
    
            .dropdown-content a:hover {
                background-color: #ddd;
                color: black;
            }
    
            .dropdown:hover .dropdown-content {
                display: block;
            }
    
            .navbar-right {
                display: flex;
                align-items: center;
            }
    
            .hamburger-menu {
                display: flex;
                flex-direction: column;
                cursor: pointer;
            }
    
            .hamburger-menu div {
                width: 25px;
                height: 3px;
                background-color: white;
                margin: 3px 0;
            }
    
            .mobile-menu {
                display: flex;
                flex-direction: column;
                align-items: end;
                position: fixed;
                top: 73px;
                right: 0;
                background-color: #333;
                padding: 10px;
                z-index: 1000;
                margin-right: 32px;
            }
    
            .mobile-menu a:hover {
                border: 1px solid black;
            }
    
            .mobile-menu a {
                color: white;
                text-decoration: none;
                padding: 5px;
                width: 100%;
                font-size: 24px;
            }
    
            @media (max-width: 768px) {
                .navbar-right {
                    display: none;
                }
    
                .mobile-menu {
                    display: flex;
                    z-index: 1000;
                }
            }
                .hidden {
                    display: none;
                }
            </style>
            <nav class="navbar">
                <div class="navbar-left">
                    <div class="dropdown">
                        <div id="outerMenu" class="flex-r">
                            <a id="Domain-URL">Locatibe</a>
                        </div>
                        <div id="outerMenuItems" class="dropdown-content hidden"></div>
                    </div>
                </div>
                <div class="navbar-right" style="margin-right: 50px;">
                    <div id="innerMenu" class="hamburger-menu">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div id="innerMenuItems" class="mobile-menu hidden"></div>
                </div>
            </nav>
        `

        return template
    }

    // Create left menu => dopDown menu items 
    // Check document DOM for Content sections, pageStructure and about, References
    checkSections(sections, menuItems) {
        //console.log("sections", sections)
        sections.forEach(section => {
            if (section.id == "page-structure") {
                this.pageStructureSection = section.parentNode
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "Page Structure";
                redirectElement.addEventListener("click", () => {
                    this.togglePageStructure();
                    this.hideInnerMenu();
                    this.moveTo("page-structure")
                });

                menuItems.appendChild(redirectElement)
            }

            else if (section.id == "about-section") {
                this.aboutSection = section.parentNode
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "About Domain";
                redirectElement.addEventListener("click", () => {
                    this.toggleAbout();
                    this.hideInnerMenu();
                    this.moveTo("about-section")
                });

                menuItems.appendChild(redirectElement)
            }

            else if (section.id == "references-section") {
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "References";
                redirectElement.addEventListener("click", () => {
                    this.hideInnerMenu();
                    this.moveTo("references-section")
                });

                menuItems.appendChild(redirectElement)
            }

            else if (section.id == "content-section") {
                //console.log(section)
                const subSections = section.querySelectorAll("section");
                let id = 1
                subSections.forEach(subSection => {
                    const redirectElement = document.createElement("a");
                    const textValue = subSection.getAttribute("name") ? subSection.getAttribute("name") : `Content Section-${id}`
                    redirectElement.textContent = textValue;
                    redirectElement.addEventListener("click", () => {
                        this.hideInnerMenu();
                        this.moveTo(subSection.id)
                    });

                    menuItems.appendChild(redirectElement)
                    id++;
                });
            }

            else if (section.id == "domain-directions") {
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "Domain Directions";
                redirectElement.addEventListener("click", () => {
                    this.hideOuterMenu();
                    this.moveTo("domain-directions")
                });

                menuItems.appendChild(redirectElement)
            }

            else if (section.id == "locative-directions") {
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "Locative Directions";
                redirectElement.addEventListener("click", () => {
                    this.hideOuterMenu();
                    this.moveTo("locative-directions")
                });

                menuItems.appendChild(redirectElement)
            }

            else if (section.id == "relevant-directions") {
                const redirectElement = document.createElement("a")
                redirectElement.textContent = "Relevant Directions";
                redirectElement.addEventListener("click", () => {
                    this.hideOuterMenu();
                    this.moveTo("relevant-directions")
                });

                menuItems.appendChild(redirectElement)
            }
        })

    }



    // Create right menu => the dropDown Menu items
    // Add Domain Direction
    // Add Locative Direction
    StructureSections() {
        const sections = document.querySelectorAll("section");
        const innerMenu = [];
        const outerMenu = [];

        // Iterate over each section element
        sections.forEach(section => {
            const id = section.getAttribute("id");

            if (["references-section", "page-structure", "about-section", "content-section"].includes(id)) {
                innerMenu.push(section);
            } else if (["domain-directions", "locative-directions", "relevant-directions"].includes(id)) {
                outerMenu.push(section);
            }
        });

        if (innerMenu.length > 0) { this.checkSections(innerMenu, this.shadowRoot.querySelector("#innerMenuItems")) }
        if (outerMenu.length > 0) {
            const outerMenuButton = this.shadowRoot.querySelector("#outerMenu")

            const button = document.createElement("button");
            button.setAttribute("id", "plusButtonNav");
            button.classList.add("dropbtn");
            button.textContent = "+"
            button.style.fontSize = "45px";
            button.style.marginLeft = "10px";
            button.addEventListener("click", () => {
                this.toggleOuterMenu();
            });

            outerMenuButton.appendChild(button)

            this.checkSections(outerMenu, this.shadowRoot.querySelector("#outerMenuItems"))
        }
    }

    toggleInnerMenu() {
        var menu = this.shadowRoot.getElementById("innerMenuItems");
        console.log("menu", menu)
        if (menu.classList.contains("hidden")) {
            menu.classList.remove("hidden");
        } else {
            menu.classList.add("hidden");
        }
    }

    hideInnerMenu() {
        var menu = this.shadowRoot.getElementById("innerMenuItems");
        menu.classList.add("hidden");
    }

    hideOuterMenu() {
        var menu = this.shadowRoot.getElementById("outerMenuItems");
        var button = this.shadowRoot.getElementById("plusButtonNav");
        menu.classList.add("hidden");
        button.textContent = "+";
    }

    toggleOuterMenu() {
        var dropdown = this.shadowRoot.getElementById("outerMenuItems");
        var button = this.shadowRoot.getElementById("plusButtonNav");
        if (dropdown.style.display === "block") {
            dropdown.classList.add("hidden");
            button.textContent = "+";
        } else {
            dropdown.classList.remove("hidden");
            button.textContent = "-";
        }
    }

    togglePageStructure() {
        if (this.pageStructureVisible) {
            this.pageStructureSection.style.transform = "translateX(-100%)";
            this.pageStructureVisible = false;
        } else {
            this.pageStructureSection.style.transform = "translateX(0%)";
            this.pageStructureVisible = true;
            this.aboutSection.style.transform = "translateX(100%)";
            this.aboutVisible = false;
        }
    }

    toggleAbout() {
        if (this.aboutVisible) {
            this.aboutSection.style.transform = "translateX(100%)";
            this.aboutVisible = false;
        } else {
            this.aboutSection.style.transform = "translateX(0%)";
            this.aboutVisible = true;
            this.pageStructureSection.style.transform = "translateX(-100%)";
            this.pageStructureVisible = false;
        }
    }

    moveTo(elementId) {
        const element = document.getElementById(elementId);
        const offset = 100
        if (element) {
            const elementTop = element.getBoundingClientRect().top - offset
            window.scrollTo({
                top: elementTop,
                behavior: 'smooth'
            });
        } else {
            console.error(`Element with ID '${elementId}' not found.`);
        }
    }
}

customElements.define('nav-bar-component', NavBarComponent);