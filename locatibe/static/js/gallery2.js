class ImageGallery extends HTMLElement {
    constructor(slides = null, caption = null, dots = null, counter = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        // Initialize slide index
        this.slideIndex = 1;
        this.productContainer = shadowRoot.querySelector('#content-container');
        this.prevBtn = shadowRoot.querySelector('#prevBtn');
        this.nextBtn = shadowRoot.querySelector('#nextBtn');

        // Call methods to initialize the component
        if (slides == null) {
            slides = Array.from(this.children)
            //console.log("slides", slides)
            slides.forEach(product => {
                product.classList = "";
                product.classList.add("mySlides", "fade")
                //console.log("img", product.querySelector("img"))
            })
        }
        //console.log("slides", this.slides)

        if (caption == true || this.getAttribute("caption") == "true") {
            this.createCaption();
            this.addCaption();
        }

        if (counter != null || this.getAttribute("counter") != null) {
            this.counterType = counter ? counter : this.getAttribute("counter");
            this.addCounter(this.counterType, slides);
        }
        
        if (dots != null || this.getAttribute("dots") != null) {
            this.dots = dots ? dots : this.getAttribute("dots");
            this.createDots();
            this.dotsContainer = shadowRoot.querySelector('#gallery-container > #dots-container');
        }
        
        // Hide navigation buttons if all items are visible or if the device is mobile
        if (this.isMobileDevice()) {

            shadowRoot.querySelector('#content-container').addEventListener('touchstart', (event) => {
                this.touchstartX = event.changedTouches[0].screenX;
            }, false);

            shadowRoot.querySelector('#content-container').addEventListener('touchend', (event) => {
                this.touchendX = event.changedTouches[0].screenX;
                this.handleSwipe();
            }, false);

            shadowRoot.querySelector('#content-container').addEventListener('touchmove', (event) => {
                event.stopPropagation();
            });
        }

        if (slides) { this.populateElements(slides) }
        if (this.dotsContainer) { this.initializeDots(slides, this.dotsContainer, this.dots); }

        this.initializeNavigation(this.prevBtn, this.nextBtn, slides.length);
    }



    handleSwipe() {
        if (this.touchstartX - this.touchendX > 50) {
            this.plusSlides(1); // Swipe left
        }
        if (this.touchendX - this.touchstartX > 50) {
            this.plusSlides(-1); // Swipe right
        }
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                * {
                box-sizing: border-box;
                }

                /* Position the image container (needed to position the left and right arrows) */
                .container {
                    position: relative;
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                }

                /* Hide the images by default */
                .mySlides {
                display: none;
                }

                img {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                }

                .hidden {
                    display: none;
                }

                /* Add a pointer when hovering over the thumbnail images */
                .cursor {
                cursor: pointer;
                }

                /* Next & previous buttons */
                .prev,
                .next {
                cursor: pointer;
                position: absolute;
                top: 40%;
                width: auto;
                padding: 16px;
                margin-top: -50px;
                color: white;
                font-weight: bold;
                font-size: 20px;
                user-select: none;
                -webkit-user-select: none;
                }

                /* Position the "next button" to the right */
                .next {
                right: 0;
                border-radius: 0 3px 3px 0;
                }

                .prev {
                left: 0;
                border-radius: 3px 0 0 3px;
                }

                /* On hover, add a black background color with a little bit see-through */
                .prev:hover,
                .next:hover {
                background-color: rgba(0, 0, 0, 0.8);
                }

                /* Number text (1/3 etc) */
                .numbertext {
                color: #f2f2f2;
                font-size: 16px;
                padding: 8px 12px;
                position: absolute;
                top: 0;
                }

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

                /* Container for image text */
                #caption-container {
                text-align: center;
                background-color: #222;
                padding: 2px 16px;
                color: white;
                }

                #dots-container {
                    background-color: #222;
                    width: auto;
                    display: -webkit-box;
                    gap: 10px;
                    padding: 10px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                    scrollbar-width: thin;
                }

                #caption-container {
                    border
                }

                .row:after {
                display: table;
                clear: both;
                }

                /* Six columns side by side */
                .column {
                    width: 20%;
                    height: 12vh; /* Default height for viewport width above 768px */
                    background-size: cover;
                    background-position: center;
                  }
                  
                @media only screen and (max-width: 500px) {
                    .column {
                      height: 8vh; /* Height for viewport width up to 500px */
                    }
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    background-color: #ccc;
                    border-radius: 50%;
                    margin: 0 5px;
                    cursor: pointer;
                }

                /* Add a transparency effect for thumnbail images */
                .demo {
                opacity: 0.6;
                border: 3px solid white
                }

                .active,
                .demo:hover {
                opacity: 1;
                }
            </style>
            <div id="gallery-container" class="container">
                <div id="content-container">
                    <a id="prevBtn" class="prev">&#10094;</a>
                    <a id="nextBtn" class="next">&#10095;</a>
                </div>
            </div>
        `;

        return template;
    }



    populateElements(slides) {
        const content = this.shadowRoot.querySelector("#content-container")
        const contentChilds = Array.from(content.children);

        contentChilds.forEach(child => {
            if (child.tagName.toLowerCase() != 'a') {
                content.removeChild(child);
            }
            //console.log(child.querySelector("img"))
        });

        // Create a deep clone of slides
        const clonedSlides = slides.map(slide => slide.cloneNode(true));

        // Reverse the cloned slides array and append them to the content container
        clonedSlides.reverse().forEach((slide, index) => {
            slide.querySelector("img").setAttribute("id", `${clonedSlides.length - index}`)
            contentChilds.unshift(slide);
        });

        contentChilds.forEach(child => {
            //console.log("child", child.querySelector("img"))
            content.appendChild(child)
        })

        //console.log("contentChilds", contentChilds)
    }


    createCaption() {
        const section = this.shadowRoot.querySelector("#gallery-container");
        const exisitingCaption = section.querySelector("#caption-container")

        if (exisitingCaption) { exisitingCaption.remove() }

        const caption = document.createElement("div")
        caption.setAttribute("id", "caption-container")
        caption.classList.add("caption-container")

        section.appendChild(caption)
    }



    addCaption() {
        const header = this.shadowRoot.querySelector("#gallery-container > #caption-container");
        const existingCaption = header.querySelector("p");

        if (existingCaption) { existingCaption.remove() }

        const caption = document.createElement("p");
        caption.setAttribute("id", "caption")

        header.appendChild(caption);
    }



    addCounter(style, slides) {
        const header = this.shadowRoot.querySelector("#gallery-container > #content-container");
    
        const existingCounters = header.querySelectorAll(".mySlides > .numbertext");
        if (existingCounters) {
            existingCounters.forEach(counter => {
                counter.remove();
            });
        }
    
        const counter = document.createElement("div");
        counter.classList.add("numbertext");
    
        switch (style) {
            case "1":
                for (let i = 0; i < slides.length; i++) {
                    const slideCounter = counter.cloneNode(true);
                    slideCounter.textContent = `Imagem ${i + 1} de ${slides.length}`;
                    slides[i].appendChild(slideCounter);
                }
                break;
            case "2":
                for (let i = 0; i < slides.length; i++) {
                    const slideCounter = counter.cloneNode(true);
                    slideCounter.textContent = `${i + 1} / ${slides.length}`;
                    slides[i].appendChild(slideCounter);
                }
                break;
        }
    }
    



    createDots() {
        const gallery = this.shadowRoot.querySelector("#gallery-container");
        const div = document.createElement("div");
        div.setAttribute("id", "dots-container");
        div.classList.add("row");

        if (gallery.querySelector("#dots-container")) {
            gallery.removeChild(gallery.querySelector("#dots-container"));
        }

        gallery.appendChild(div);
    }



    initializeDots(slides, dotsContainer, dots) {
        slides.forEach((item, index) => {
            if (dots == "1") {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    this.currentSlide(index);
                });
                dotsContainer.appendChild(dot);
            } else {
                const dot = document.createElement('div');
                dot.classList.add('column');
                dot.addEventListener('click', () => {
                    this.currentSlide(index);
                });
    
                // Clone the image element
                const img = item.querySelector("img");
                dot.classList = "";
                dot.classList.add("column", "demo", "cursor");
                dot.setAttribute("style", `background-image: url(${img.getAttribute("src")});`)
                dot.setAttribute("id", `${index + 1}`)
                dotsContainer.appendChild(dot);
            }
        });
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
        if (childCount == 1 || this.isMobileDevice()) {
            console.log("true")
            prevBtn.classList.add("hidden")
            nextBtn.classList.add("hidden")
        }
        else {
            prevBtn.classList.remove("hidden")
            nextBtn.classList.remove("hidden")
        }
    }



    // Next/previous controls
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    // Thumbnail image controls
    currentSlide(n) {
        this.showSlides(this.slideIndex = n + 1);
    }

    showSlides(n) {
        let i;
        const slides = this.shadowRoot.querySelectorAll(".mySlides");
        const dots = this.shadowRoot.querySelectorAll(".column, .dot");
        const captionText = this.shadowRoot.querySelector("p#caption");
        if (n > slides.length) { this.slideIndex = 1 }
        if (n < 1) { this.slideIndex = slides.length }

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        slides[this.slideIndex - 1].style.display = "block";

        dots[this.slideIndex - 1].classList.add("active");
        const dotsContainer = this.shadowRoot.querySelector("#gallery-container > #dots-container");
        const position = this.isInViewport(dotsContainer, dots[this.slideIndex - 1])
        if (position !== true) {
            this.scrollByDifference(dotsContainer, position);
        }
        captionText.innerHTML = slides[this.slideIndex - 1].querySelector("img").alt;
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

    isInViewport(container, element) {
        const boundingC = container.getBoundingClientRect();
        const boundingE = element.getBoundingClientRect();
    
        if (
            boundingE.top >= boundingC.top &&
            boundingE.left >= boundingC.left &&
            boundingE.bottom <= boundingC.bottom &&
            boundingE.right <= boundingC.right
        ) {
            return true;
        } else {
            let difference = {};
    
            if (boundingE.right > boundingC.right) {
                difference.right = boundingE.right - boundingC.right;
            } else if (boundingE.left < boundingC.left) {
                difference.left = boundingC.left - boundingE.left;
            }
    
            return difference;
        }
    }

    scrollByDifference(container, difference) {
        if (difference.right) {
            container.scrollBy({
                left: difference.right + 10,
                behavior: 'smooth'
            });
        } else if (difference.left) {
            container.scrollBy({
                left: -difference.left - 10,
                behavior: 'smooth'
            });
        }
    }
}

customElements.define('gallery-component', ImageGallery);