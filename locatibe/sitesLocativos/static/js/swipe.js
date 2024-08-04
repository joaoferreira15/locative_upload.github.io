class SwipeScroll extends HTMLElement {
    constructor(productItems = null, tooltip = null, title = null, dots = null, orientation = null, css = null) {
        super();

        // Create a shadow DOM
        const shadowRoot = this.attachShadow({ mode: "open" });
        // Append the template content to the Shadow DOM
        shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.productContainer = shadowRoot.querySelector('.products-container');
        this.prevBtn = shadowRoot.querySelector('#prevBtn');
        this.nextBtn = shadowRoot.querySelector('#nextBtn');
        this.productItems = productItems;

        const styleValue = `
        .featured-products {
            text-align: left;
            padding: 20px;
            width: 100%;
        }

        /* Tooltip container */
        .tooltip {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        }

        /* Tooltip text */
        .tooltip .tooltiptext {
        visibility: hidden;
        width: fit-content;
        background-color: #000;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        z-index: 1;
        font-size: 16px;
        border: 5px;
        }

        .text-tool-tip {
            margin: 5px
        }
        
        /* Show the tooltip text when hovering over the container */
        .tooltip:hover .tooltiptext, .tooltip:hover .pointer{
        visibility: visible;
        }

        .tooltip .pointer {
            visibility: hidden;
            border-width: 5px;
            border-style: solid;
            border-color: transparent #000 transparent transparent;
          }

        .featured-products h2 {
            margin-left: 10px;
        }

        .products-container {
            display: flex;
            overflow-x: scroll;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            scrollbar-width: none;
        }

        /* Next & previous buttons */
        .prev,
        .next {
            cursor: pointer;
            width: auto;
            padding: 16px;
            color: white;
            font-weight: bold;
            font-size: 20px;
            border-radius: 3px 0 0 3px;
            user-select: none;
            -webkit-user-select: none;
            border: none;
            background-color: lightgray;
        }

        /* Position the "next button" to the right */
            .next {
            border-radius: 3px 0 0 3px;
            border-radius: 0 3px 3px 0;
        }

        /* On hover, add a black background color with a little bit see-through */
            .prev:hover,
            .next:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        .hidden {
            display: none;
        }

        .product-item {
            flex: 0 0 auto;
            width: 200px;
            margin: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: left;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            transition: box-shadow 0.2s ease-in-out;
        }

        .product-item:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        }

        .product-item img {
            width: 100%;
            height: auto;
        }

        .product-item h3 {
            margin-top: 10px;
        }

        .product-item:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        }

        .product-item p {
            margin-bottom: 10px;
        }

        .product-item button {
            background-color: #333;
            color: #fff;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            left: 50%;
            right: 50%;
            transform: translate(-50%);
        }

        .content-container {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .navigation {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .navigation button {
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            margin: 0 5px;
        }

        button:disabled {
            opacity: 0.1;
            cursor: default;
        }

        .dots-container {
            display: flex;
            justify-content: center;
            margin-top: 10px; 
        }

        .dot {
            width: 10px;
            height: 10px;
            background-color: #ccc;
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
        }

        .dot.active {
            background-color: #333;
        }

        @media only screen and (max-width: 768px) {
            .products-container {
                overflow-x: auto;
                scroll-snap-type: none;
            }
        }

        .fd-c {
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
            scroll-behavior: smooth;
            scrollbar-width: thin;
        }

        .vertical{
            justify-content: center;
        }
        `

        if (orientation != null || this.getAttribute("orientation") != null) {
            this.orientation = orientation ? orientation : this.getAttribute("orientation");
            if (this.orientation == "vertical") {
                dots == false
                this.setAttribute("dots", "false");
                const carousel = shadowRoot.querySelector("#featured-products > #content-container > #products-container")
                const content = shadowRoot.querySelector("#featured-products > #content-container")
                content.classList.add("vertical")
                carousel.classList.add("fd-c")
                this.prevBtn.classList.add("hidden")
                this.nextBtn.classList.add("hidden")
            }
        }

        if (css != null || this.getAttribute("css") != null) {
            this.cssPath = css ? css : this.getAttribute("css");
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

        if (dots == true || this.getAttribute("dots") == "true") {
            this.addDots();
            this.dotsContainer = shadowRoot.querySelector('.dots-container');
        }

        if (title != null || this.getAttribute("title") != null) {
            const titleValue = title ? title : this.getAttribute("title");
            this.addTitle(titleValue);

            if (tooltip != null || this.getAttribute("tooltip") != null) {
                const tooltipValue = tooltip ? tooltip : this.getAttribute("tooltip");
                this.addTitleValue(tooltipValue);
            }
        }

        // Call methods to initialize the component
        if (productItems == null) {
            this.productItems = Array.from(this.children)
            //console.log(this.productItems)
            this.productItems.forEach(product => {
                product.classList.add("product-item")
            })
            //console.log(this.productItems)
        }

        this.populateElements(this.productItems)

        this.allDivs = Array.from(this.productContainer.children); // List of all child divs
        //console.log(this.productItems)

        this.seenDivs = this.getTopSectionInView(this.productItems); // Initialize seenDivs with initial visible items
        window.addEventListener('resize', this.updateSeenDivs.bind(this));

        this.childWidth = this.productItems[0].offsetWidth; // Width of each child div
        console.log(this.childWidth)
        if (this.dotsContainer) { this.initializeDots(this.allDivs, this.seenDivs, this.dotsContainer); }
        this.initializeNavigation(this.allDivs, this.seenDivs, this.prevBtn, this.nextBtn, this.productContainer, this.childWidth);
    }



    updateSeenDivs() {
        const seenDivs = this.getTopSectionInView(this.productItems);
        //console.log("Done", seenDivs)
        this.initializeNavigation(this.allDivs, seenDivs, this.prevBtn, this.nextBtn, this.productContainer, this.childWidth);
    }



    getTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
        <style></style>
        <div id="featured-products" class="featured-products">
            <div id="content-container" class="content-container">
                <button id="prevBtn" class="prev" disabled>&#10094;</button>
                <div id="products-container" class="products-container"></div>
                <button id="nextBtn" class="next">&#10095;</button>
            </div>
        </div>
        `;

        return template;
    }



    populateElements(productItems) {
        const productsContainer = this.shadowRoot.getElementById("products-container")
        const contentChilds = Array.from(productsContainer.children);

        contentChilds.forEach(child => {
            if (child.tagName.toLowerCase() != 'button') {
                productsContainer.removeChild(child);
            }
            //console.log(child.querySelector("img"))
        });

        productItems.forEach(item => {
            productsContainer.appendChild(item);
        });

        if (this.orientation == "vertical") {
            const carousel = this.shadowRoot.querySelector("#featured-products > #content-container > #products-container")
            carousel.style.height = `${(productItems[0].offsetHeight + 10) * 2}px`
        }
        //console.log("productsContainer", productsContainer.children)
    }



    addTitle(titleValue) {
        const section = this.shadowRoot.getElementById("featured-products");
        const div = document.createElement("div");
        div.id="swipe-title"
        div.classList.add("tooltip")
        const title = document.createElement("h2");
        title.textContent = titleValue
        div.appendChild(title)

        // Creating an array with section's child elements
        const childElements = Array.from(section.children);
        childElements.unshift(div)

        section.innerHTML = "";
        childElements.forEach(child => {
            section.appendChild(child);
        });
        //console.log(childElements)
    }


    addTitleValue(tooltipValue) {
        const swipeTitleDiv = this.shadowRoot.getElementById("swipe-title");
        
        const pointer = document.createElement("span")
        pointer.classList.add("pointer")
        const span = document.createElement("span")
        span.classList.add("tooltiptext")
        span.innerHTML = `<span class="text-tool-tip">${tooltipValue}</span>`

        swipeTitleDiv.appendChild(pointer)
        swipeTitleDiv.appendChild(span)

    }

    addDots() {
        const section = this.shadowRoot.getElementById("featured-products");
        const exisitingDots = section.querySelector(".dots-container")

        if (exisitingDots) { exisitingDots.remove() }

        const div = document.createElement("div");
        div.classList.add("dots-container");
        section.appendChild(div);

        /*// Creating an array with section's child elements
        const childElements = Array.from(section.children);
        childElements.forEach( (child, index) => {
            if (child.getAttribute("id") == "products-navigation") {
                // Other array manipulating methods include push at the array end and unshift fot the brggining 
                childElements.splice(index, 0, div); // At the index "index" remove 0 items and add "div"
            }
        })*/
        //console.log(childElements)
    }



    initializeDots(allDivs, seenDivs, dotsContainer) {
        // Generate dots for navigation
        const count = allDivs.length - seenDivs.length
        console.log("count", count)

        if (count > 0) {
            for (let index = 0; index <= count; index++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    this.goToSlide(dot, index);
                });
                dotsContainer.appendChild(dot);
            }
        }
    }



    initializeNavigation(allDivs, seenDivs, prevBtn, nextBtn, productContainer, childWidth) {
        //console.log("initializeNavigation executed", seenDivs)

        if (this.prevBtnClickHandler) { prevBtn.removeEventListener('click', this.prevBtnClickHandler); }
        if (this.prevBtnClickHandler) { nextBtn.removeEventListener('click', this.nextBtnClickHandler); }

        // Define the event listener functions
        this.prevBtnClickHandler = () => this.moveSlide('prev', allDivs, seenDivs, productContainer, childWidth, prevBtn, nextBtn);
        this.nextBtnClickHandler = () => this.moveSlide('next', allDivs, seenDivs, productContainer, childWidth, prevBtn, nextBtn);

        // Add event listeners
        prevBtn.addEventListener('click', this.prevBtnClickHandler);
        nextBtn.addEventListener('click', this.nextBtnClickHandler);

        // Hide prevBtn if no more items to move left
        prevBtn.disabled = seenDivs[0] === allDivs[0];
        // Hide nextBtn if no more items to move right
        nextBtn.disabled = seenDivs[seenDivs.length - 1] === allDivs[allDivs.length - 1];

        // Hide navigation buttons if all items are visible or if the device is mobile
        if (seenDivs.length == allDivs.length || this.isMobileDevice()) {
            prevBtn.classList.add("hidden")
            nextBtn.classList.add("hidden")
        }
        else {
            prevBtn.classList.remove("hidden")
            nextBtn.classList.remove("hidden")
        }
    }



    goToSlide(dot, index) {
        const scrollAmount = index * this.childWidth;
        const section = this.shadowRoot.getElementById("featured-products");
        const dotsList = section.querySelectorAll(".dots-container > .dot")

        this.productContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        console.log("scrollAmount", scrollAmount)
        dotsList.forEach(dotElement => {
            if (dotElement == dot) {
                dotElement.classList.add("active")
            } else { dotElement.classList.remove("active") }
        });

        const firstDot = dotsList[0]
        if (firstDot.classList.contains("active") && !this.prevBtn.getAttribute("disabled")) {
            this.prevBtn.setAttribute("disabled", true);
        } else {
            this.prevBtn.removeAttribute("disabled");
        }
        const lastDot = dotsList[dotsList.length - 1]
        console.log(lastDot)
        if (lastDot.classList.contains("active") && !this.prevBtn.getAttribute("disabled")) {
            this.nextBtn.setAttribute("disabled", true);
        } else {
            this.nextBtn.removeAttribute("disabled");
        }
    }



    getTopSectionInView(productItems) {
        return Array.from(productItems).filter(item => {
            const rect = item.getBoundingClientRect();
            return (
                rect.left >= 0 &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        });
    }



    moveSlide(direction, allDivs, seenDivs, productContainer, childWidth, prevBtn, nextBtn) {
        let targetIndex;
        if (direction === 'prev') {
            const firstItemIndex = allDivs.indexOf(seenDivs[0]);
            targetIndex = firstItemIndex - 1;
            if (targetIndex >= 0) {
                const newItem = allDivs[targetIndex];
                seenDivs.pop();
                seenDivs.unshift(newItem);
                const scrollAmount = productContainer.scrollLeft - childWidth - 20;
                productContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                nextBtn.disabled = false;
            }
            if (seenDivs[0] === allDivs[0]) {
                prevBtn.disabled = true;
            }
        } else if (direction === 'next') {
            const lastItemIndex = allDivs.indexOf(seenDivs[seenDivs.length - 1]);
            targetIndex = lastItemIndex + 1;
            if (targetIndex < allDivs.length) {
                const newItem = allDivs[targetIndex];
                seenDivs.shift();
                seenDivs.push(newItem);
                const scrollAmount = productContainer.scrollLeft + childWidth + 20;
                productContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                prevBtn.disabled = false;
            }
            if (seenDivs[seenDivs.length - 1] === allDivs[allDivs.length - 1]) {
                nextBtn.disabled = true;
            }
        }
        this.updateDots(allDivs, seenDivs);
    }



    updateDots(allDivs, seenDivs) {
        const dotsContainer = this.shadowRoot.querySelector('.dots-container');
        const currentIndex = allDivs.indexOf(seenDivs[0]);
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }



    // Function to detect if a browser is mobile or desktop
    isMobileDevice() {
        // Check if the user agent string contains keywords commonly found in mobile devices
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'windows phone'];
        const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));

        // Check if the screen width is smaller than a certain threshold
        // const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        // const isSmallScreen = screenWidth < 768; // Adjust the threshold as needed

        // Check if the device supports touch events
        const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        return isMobile || supportsTouch;
    }
}

// Define the custom element
customElements.define('swipe-component', SwipeScroll);
