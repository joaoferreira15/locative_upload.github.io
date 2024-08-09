class PageStructure extends HTMLElement {
    constructor() {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        window.addEventListener('DOMContentLoaded', () => this.createSectionNavigation());
    }

    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                ol {
                    list-style-type: none;
                    counter-reset: section;
                }
                
                li {
                    counter-increment: section;
                }
                
                li::before {
                    content: counters(section, ".") ". ";
                }
            </style>
            <div id="title" class="page border-bottom">
                <h2>Pages Contents</h2>
            </div>
            <div id="section-listing" class="title">
                <ol id="section-list" class="section-list"></ol>
            </div>
        `

        return template
    }

    createSectionNavigation() {
        const olSectionList = this.shadowRoot.getElementById('section-list');
        const sections = document.querySelectorAll('section[id][name]');
        const filteredSections = Array.from(sections).filter(section => {
            let parent = section.parentNode;
            while (parent && parent.nodeName !== 'BODY') {
                if (parent.nodeName === 'SECTION') {
                    return false;
                }
                parent = parent.parentNode;
            }
            return true;
        });
        //console.log(sections, filteredSections)
        
        function createSectionLinks(section, sectionList){
            const li = document.createElement('li');
            const link = document.createElement('a');
            const sectionName = section.getAttribute('name') ? section.getAttribute('name') : section.getAttribute('id');

            link.textContent = sectionName;
            link.href = `#${section.id}`;
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetSection = document.getElementById(section.id);
                targetSection.scrollIntoView({ behavior: 'smooth' });
                toggleLeft();
            });
            li.appendChild(link);
            sectionList.appendChild(li);
            
            const containsSection = Array.from(section.childNodes).filter(node => node.nodeName === 'SECTION');
            if (containsSection) {
                const ol = document.createElement("ol")
                ol.setAttribute("id", "section-list")
                ol.classList.add("section-list")
                li.appendChild(ol)
                
                containsSection.forEach( child => {
                    createSectionLinks(child, ol);
                });
            }
        };
    
        filteredSections.forEach(section => {
            //console.log("starter", section, olSectionList)
            createSectionLinks(section, olSectionList);
        });
    }
}

customElements.define('page-structure-component', PageStructure);