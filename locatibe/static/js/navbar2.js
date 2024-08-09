import { fetchData } from "./lib/functions.js";

class NavBarComponent extends HTMLElement {
    constructor(domainURL = null, css = null) {
        super();
        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        const styleValue = `
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

        .sidenav {
            height: 100%;
            width: 0px;
            position: fixed;
            right: 0;
            top: 0;
            background-color: #111;
            padding-top: 20px;
            transition: 0.5s;
            overflow-x: hidden;
            color: white;
        }

        .sidenav a {
            padding: 8px 8px 8px 32px;
            text-decoration: none;
            font-size: 25px;
            color: #818181;
            display: block;
            transition: 0.3s;
        }

        .sidenav a:hover {
            color: #f1f1f1;
        }

        .sidenav .closebtn {
            position: absolute;
            top: 0;
            right: 25px;
            font-size: 36px;
            margin-left: 50px;
        }

        .main {
            margin-left: 250px; /* Same as the width of the sidenav */
            padding: 16px;
            transition: margin-left .5s;
        }

        .menu-header {
            font-size: 18px;
            padding: 10px 32px;
            text-transform: uppercase;
            color: #f1f1f1;
        }

        .sidenav .repo, .sidenav .teams {
            padding-left: 20px;
        }

        .sidenav .repo a, .sidenav .teams a {
            font-size: 20px;
        }`

        if (domainURL != null || this.getAttribute("domainURL") != null) {
            const urlValue = domainURL ? domainURL : this.getAttribute("domainURL");
            shadowRoot.querySelector("#Domain-URL").setAttribute("href", urlValue);
            shadowRoot.querySelector("#Domain-URL").setAttribute("target", "_blank");
        }

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

        this.StructureSections();

        // Bind methods
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style></style>
            <nav class="navbar">
                <div class="navbar-left">
                    <div class="dropdown">
                        <div id="outerMenu" class="flex-r">
                            <a id="Domain-URL">Locatibe</a>
                        </div>
                        <div id="outerMenuItems" class="dropdown-content hidden"></div>
                    </div>
                </div>
                <div class="main">
                    <span style="font-size:30px;cursor:pointer" id="openMenuBtn">&#9776; Menu</span>
                </div>
                <div id="mySidenav" class="sidenav">
                    <a href="javascript:void(0)" class="closebtn" id="closeMenuBtn">&times;</a>
                </div>
            </nav>
        `
        return template
    }

    connectedCallback() {
        // Add event listeners
        this.shadowRoot.querySelector('#openMenuBtn').addEventListener('click', this.openNav);
        this.shadowRoot.querySelector('#closeMenuBtn').addEventListener('click', this.closeNav);
    }

    disconnectedCallback() {
        // Clean up event listeners
        this.shadowRoot.querySelector('#openMenuBtn').removeEventListener('click', this.openNav);
        this.shadowRoot.querySelector('#closeMenuBtn').removeEventListener('click', this.closeNav);
    }

    // Create left menu => dopDown menu items 
    // Check document DOM for Content sections, pageStructure and about, References
    checkSections(sections, menuItems) {
        sections.forEach(section => {
            const menuTitle = document.createElement("div");
            menuTitle.textContent = section.getAttribute("name") ? section.getAttribute("name") : this.createTitle(section.id);

            const subSections = section.querySelectorAll("section");
            if (subSections) {
                subSections.forEach(subSection => {
                    const redirectElement = document.createElement("a");
                    redirectElement.textContent = subSection.getAttribute("name") ? subSection.getAttribute("name") : this.createTitle(subSection.id);
                    redirectElement.addEventListener("click", () => {
                        this.closeNav();
                        this.moveTo(`${subSection.id}`);
                    });

                    menuTitle.appendChild(redirectElement);
                });
            }

            menuItems.appendChild(menuTitle);
        });
    }

    // Create right menu => the dropDown Menu items
    // Add Domain Direction
    // Add Locative Direction
    StructureSections() {
        const sections = Array.from(document.querySelectorAll("body > section"));
        if (sections) { this.checkSections(sections, this.shadowRoot.querySelector("#mySidenav")); }
    }

    openNav() {
        this.shadowRoot.querySelector("#mySidenav").style.width = "250px";
        this.shadowRoot.querySelector(".main").style.marginLeft = "250px";
    }

    closeNav() {
        this.shadowRoot.querySelector("#mySidenav").style.width = "0";
        this.shadowRoot.querySelector(".main").style.marginLeft = "0";
    }

    moveTo(elementId) {
        const element = document.getElementById(elementId);
        const offset = 100;
        if (element) {
            const elementTop = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: elementTop,
                behavior: 'smooth'
            });
        } else {
            console.error(`Element with ID '${elementId}' not found.`);
        }
    }

    createTitle(input) {
        return input
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}

customElements.define('nav-bar-component', NavBarComponent);
