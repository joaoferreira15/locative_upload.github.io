class DomainDirectionsSlider extends HTMLElement {
    constructor(slides = null, title = null, dots = null, counter = null, orientation = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Initialize slide index
        this.expanded = false
        this.memo = []
        this.slideIndex = 1;
        this.productContainer = shadowRoot.querySelector('#carousel');
        this.prevBtn = shadowRoot.querySelector('#prevBtn');
        this.nextBtn = shadowRoot.querySelector('#nextBtn');
        this.expandState = false

        if (orientation != null || this.getAttribute("orientation") != null) {
            this.orientation = orientation ? orientation : this.getAttribute("orientation");
            if (this.orientation == "vertical") {
                console.log(true)
                this.dots == false
                this.setAttribute("dots", "false");
                const carousel = shadowRoot.querySelector("#slideshow-container > #carousel")
                carousel.classList.add("fd-c")
                this.prevBtn.classList.add("hidden")
                this.nextBtn.classList.add("hidden")
            }
            const carousel = shadowRoot.querySelector("#slideshow-container > #carousel > #slides-listing")
            carousel.classList.add(this.orientation)
        }

        if (title != null || this.getAttribute("title") != null) {
            const titleValue = title ? title : this.getAttribute("title");
            this.createheader();
            this.addTitle(titleValue);
        }

        if (dots == true || this.getAttribute("dots") == "true") {
            this.dots = "true";
            this.createDots();
            this.dotsContainer = shadowRoot.querySelector('#slideshow-container > #dots-container');
        }

        if (counter != null || this.getAttribute("counter") != null) {
            this.counterType = counter ? counter : this.getAttribute("counter");
            this.count = Array.from(this.children).length
            if (!shadowRoot.querySelector("#slideshow-container > .cabeçalho")) { this.createheader(); }
            this.addCounter(this.counterType, this.count);
        }

        // Call methods to initialize the component
        if (slides == null) {
            this.slides = Array.from(this.children)
            //console.log(this.slides)
            this.slides.forEach(product => {
                product.classList = "";
                product.classList.add("mySlides", "fade")
            })
        }

        // Hide navigation buttons if all items are visible or if the device is mobile
        if (this.isMobileDevice()) {
            shadowRoot.querySelector('#carousel').addEventListener('touchstart', (event) => {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            shadowRoot.querySelector('#carousel').addEventListener('touchend', (event) => {
                this.touchendX = event.changedTouches[0].screenX;
                this.handleSwipe();
            }, false);
        }

        if (this.slides) { this.populateElements(this.slides, this.orientation) }
        if (this.dotsContainer) { this.initializeDots(this.slides, this.dotsContainer); }

        this.initializeNavigation(this.prevBtn, this.nextBtn, this.slides);

        // Add event listener to handle the custom event dispatched by the parent
        this.addEventListener('toggleDivsInput', () => {
            // Execute the logic specific to the child component
            console.log("recebido")
            //console.log("this", this)
            const response = [this.slides, this.expanded, this.memo, this];

            // Dispatch a response event back to the parent
            const responseEvent = new CustomEvent('responseEvent', {
                bubbles: true,
                composed: true,
                detail: response // Include any data you want to send back to the parent
            });
            this.dispatchEvent(responseEvent);
        });

        this.addEventListener('updatedExpandedState', event => {
            // Access the updated expandedState from the event detail
            this.expanded = event.detail[0];
            this.memo = event.detail[1];
            console.log("recebido 3", event.detail[0], event.detail[1])
        });

        this.addEventListener('toggleDivsInput', this.handleToggleDivsInput)
    }



    handleSwipe() {
        if (this.touchstartX - this.touchendX > 50) {
            this.plusSlides(1); // Swipe left
        }
        if (this.touchendX - this.touchstartX > 50) {
            this.plusSlides(-1); // Swipe right
        }
    }



    handleToggleDivsInput(event) {
        console.log("received")
        const children = Array.from(this.shadowRoot.querySelector("#carousel > #slides-listing").children)
        if (this.expandState == false) {
            children.forEach(child => {
                child.classList.remove("hidden")
            })
            this.prevBtn.classList.add("hidden")
            this.nextBtn.classList.add("hidden")
            this.expandState = true
        } else {
            this.showSlides(this.slideIndex)
            this.prevBtn.classList.remove("hidden")
            this.nextBtn.classList.remove("hidden")
            this.expandState = false
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                }

                .fd-c {
                    flex-direction: column;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    scroll-snap-type: y mandatory;
                    scroll-behavior: smooth;
                    scrollbar-width: thin;
                }

                .slideshow-container {
                    max-width: 95%;
                    position: static;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                }

                .cabeçalho {
                    display: flex;
                    flex-direction: row;
                    align-items: baseline;
                    justify-content: space-between;
                }

                .hidden {
                    display: none !important
                }

                .carousel {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                
                .mySlides {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px
                }

                .object {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: left;
                    max-width: 250px;
                    border: 1px solid black;
                    border-radius: 12px;
                    overflow: hidden;
                    object-fit: cover;
                    text-decoration: none;
                }

                .imagem {
                    width: 100%;
                }

                .prev,
                .next {
                    cursor: pointer;
                    width: auto;
                    margin-top: -22px;
                    padding: 16px;
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    transition: 0.6s ease;
                    border-radius: 3px 0 0 3px;
                    user-select: none;
                    background-color: lightgray;
                }

                .prev {
                    margin-right: 10px;
                }

                .next {
                    margin-left: 10px;
                }

                /* Position the "next button" to the right */
                .next {
                    border-radius: 0 3px 3px 0;
                }

                /* On hover, add a black background color with a little bit see-through */
                .prev:hover,
                .next:hover {
                    background-color: grey;
                }

                /* Caption text */
                .text {
                    color: #f2f2f2;
                    font-size: 15px;
                    padding: 8px 12px;
                    position: absolute;
                    bottom: 8px;
                    width: 100%;
                    text-align: center;
                }

                /* Number text (1/3 etc) */
                .numbertext {
                    color: #f2f2f2;
                    font-size: 14px;
                    padding: 8px 12px;
                    position: absolute;
                    top: 0;
                }

                /* The dots/bullets/indicators */
                .dot,
                .dot2 {
                    cursor: pointer;
                    height: 15px;
                    width: 15px;
                    margin: 0 2px;
                    background-color: #bbb;
                    border-radius: 50%;
                    display: inline-block;
                    transition: background-color 0.6s ease;
                }

                .active,
                .dot:hover {
                    background-color: #717171;
                }

                /* Fading animation */
                .fade {
                    animation-name: fade;
                    animation-duration: 1.5s;
                }

                @keyframes fade {
                    from {
                        opacity: .4
                    }

                    to {
                        opacity: 1
                    }
                }

                .horizontal {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2vw;
                }

                .vertical {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2vh;
                }

                #slides-listing {
                    text-align: center;
                }

            </style>
            <div id="slideshow-container" class="slideshow-container">
                <div id="carousel" class="carousel">
                    <a id="prevBtn" class="prev">&#10094;</a>
                    <!-- items to slide -->
                    <div id="slides-listing"></div>
                    <a id="nextBtn" class="next">&#10095;</a>
                </div>
                <br>
            </div>
        `;

        return template
    }



    populateElements(slides) {
        const shadowRoot = this.shadowRoot;
        const carousel = shadowRoot.querySelector("#carousel > #slides-listing")
        const carouselChilds = Array.from(carousel.children);

        if (carouselChilds.length > 0) {
            carouselChilds.forEach(child => {
                carousel.removeChild(child);
            });
        }

        slides.forEach(child => {
            carousel.appendChild(child)
        })

    }



    createheader() {
        const section = this.shadowRoot.querySelector("#slideshow-container");
        const header = document.createElement("div")
        header.classList.add("cabeçalho")

        const exisitingHeader = section.querySelector(".cabeçalho")
        if (exisitingHeader) { exisitingHeader.remove() }

        const childElements = Array.from(section.children);
        childElements.unshift(header)

        section.innerHTML = "";
        childElements.forEach(child => {
            section.appendChild(child);
        });
    }



    addTitle(titleValue) {
        const header = this.shadowRoot.querySelector("#slideshow-container > .cabeçalho");
        const existingTitle = header.querySelector("h3");
        if (existingTitle) { existingTitle.textContent = titleValue; }
        else {
            const title = document.createElement("h3");
            title.textContent = titleValue
            header.appendChild(title);
        }
    }



    addCounter(style, count) {
        const header = this.shadowRoot.querySelector(".cabeçalho");

        const existingCounter = header.querySelector("p");
        if (existingCounter) { existingCounter.remove(); }

        const counter = document.createElement("p");
        switch (style) {
            case "1":
                counter.textContent = `Página 1 de ${count}`;
                break;
            case "2":
                counter.textContent = `1 / ${count}`;
                break;
        }

        header.appendChild(counter)
    }



    createDots() {
        const slideShow = this.shadowRoot.querySelector("#slideshow-container");
        const div = document.createElement("div");
        div.setAttribute("id", "dots-container");
        div.setAttribute("style", "text-align:center");

        if (slideShow.querySelector("#dots-container")) {
            slideShow.removeChild(dotsContainer);
        }
        slideShow.appendChild(div);
        //console.log(childElements)
    }



    initializeDots(slides, dotsContainer) {
        // Generate dots for navigation
        //console.log("dotsContainer", dotsContainer)
        //console.log("slides", slides)
        slides.forEach((item, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                this.currentSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        //console.log("dotsContainer childs", dotsContainer.children)
    }



    initializeNavigation(prevBtn, nextBtn, childCount) {
        // Call function to initialize slideshow
        this.showSlides(this.slideIndex);

        // Add event listeners for next/previous buttons
        if (this.prevBtnClickHandler) { prevBtn.removeEventListener('click', this.prevBtnClickHandler); }
        if (this.prevBtnClickHandler) { nextBtn.removeEventListener('click', this.nextBtnClickHandler); }

        // Define the event listener functions
        this.prevBtnClickHandler = () => this.plusSlides(-1);
        this.nextBtnClickHandler = () => this.plusSlides(1)

        // Add event listeners
        prevBtn.addEventListener('click', this.prevBtnClickHandler);
        nextBtn.addEventListener('click', this.nextBtnClickHandler);

        //console.log(this.slideIndex, childCount)

        // Hide navigation buttons if all items are visible or if the device is mobile
        if (this.slideIndex == childCount || this.isMobileDevice() && this.orientation == "horizontal") {
            prevBtn.classList.add("hidden")
            nextBtn.classList.add("hidden")
        }
        else {
            prevBtn.classList.remove("hidden")
            nextBtn.classList.remove("hidden")
        }
    }



    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }



    currentSlide(n) {
        this.showSlides(this.slideIndex = n + 1);
    }



    showSlides(n) {
        let i;
        const slides = this.shadowRoot.querySelectorAll('#carousel > #slides-listing > .mySlides');
        if (n > slides.length) { this.slideIndex = 1; }
        if (n < 1) { this.slideIndex = slides.length; }

        if (this.orientation == "horizontal") {
            for (i = 0; i < slides.length; i++) {
                slides[i].classList.add("hidden");
            }
            //console.log("slide", this.slideIndex, slides[this.slideIndex])
            slides[this.slideIndex - 1].classList.remove("hidden");
        }

        const dots = this.shadowRoot.querySelectorAll('#slideshow-container > #dots-container > .dot');
        if (dots.length != 0) {
            for (i = 0; i < dots.length; i++) {
                dots[i].classList.remove("active");
            }
            dots[this.slideIndex - 1].classList.add("active");
        }

        const counter = this.shadowRoot.querySelector("#slideshow-container > .cabeçalho > p")
        switch (this.counterType) {
            case "1":
                counter.textContent = `Página ${this.slideIndex} de ${this.count}`;
                break;
            case "2":
                counter.textContent = `${this.slideIndex} / ${this.count}`;
                break;
        }
    }



    isMobileDevice() {
        // Check if the user agent string contains keywords commonly found in mobile devices
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'windows phone'];
        const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));

        // Check if the screen width is smaller than a certain threshold
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const isSmallScreen = screenWidth < 768; // Adjust the threshold as needed

        // Check if the device supports touch events
        const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        return isMobile || isSmallScreen || supportsTouch;
    }
}

// Define the custom element
customElements.define('carousel-pair-component', DomainDirectionsSlider);
