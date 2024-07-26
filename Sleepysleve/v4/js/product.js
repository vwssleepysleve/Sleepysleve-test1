document.addEventListener("DOMContentLoaded", function() {
    // Variables to handle swipe detection
    let startX, startY, endX, endY;
    const imageFrame = document.getElementById('image-frame');

    // Function to fetch product details
    const getProductDetails = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const category = urlParams.get('category');

        // Fetch data from JSON file based on category
        fetch(`./data/${category}.json`)
            .then(response => response.json())
            .then(data => {
                const product = data.products.find(product => product.id === parseInt(productId, 10));
                if (product) {
                    displayProductDetails(product);
                } else {
                    console.error(`Product with id ${productId} not found in category ${category}`);
                    displayErrorMessage();
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
                displayErrorMessage();
            });
    };

    // Function to display product details on the page
    const displayProductDetails = (product) => {
        // Load the thumbnail as the first image
        const images = [product.thumbnail, ...product.images];

        // Display images
        images.forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.alt = `${product.name} - ${index + 1}`;
            imgElement.classList.add('product-image');
            imgElement.style.transform = `translateX(${index * 100}%)`;
            imageFrame.appendChild(imgElement);

            const indicator = document.createElement('div');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => showImage(index));
            document.getElementById('image-indicators').appendChild(indicator);
        });

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `₹${product.price.toFixed(2)}`;
        document.getElementById('product-ex-price').textContent = `₹${product.ex_price.toFixed(2)}`;
        document.getElementById('product-discount').textContent = `${product.discount_percentage}% off`;
        document.getElementById('description-content').textContent = product.description;

        // Hide loader once content is loaded
        document.querySelector(".loader").style.display = "none";
    };

    // Function to show the selected image
    const showImage = (index) => {
        const images = document.querySelectorAll('.product-image');
        images.forEach((img, idx) => {
            img.style.transform = `translateX(${(idx - index) * 100}%)`;
        });

        const indicators = document.querySelectorAll('.image-indicators div');
        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === index);
        });
    };

    // Handle swipe events
    imageFrame.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    imageFrame.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    const handleSwipe = () => {
        const threshold = 50; // Minimum distance in pixels to consider it a swipe
        const currentImageIndex = [...document.querySelectorAll('.product-image')]
            .findIndex(img => img.style.transform === 'translateX(0%)');
        if (startX - endX > threshold) {
            // Swipe left
            if (currentImageIndex < document.querySelectorAll('.product-image').length - 1) {
                showImage(currentImageIndex + 1);
            }
        } else if (endX - startX > threshold) {
            // Swipe right
            if (currentImageIndex > 0) {
                showImage(currentImageIndex - 1);
            }
        }
    };

    // Function to display error message if product not found
    const displayErrorMessage = () => {
        document.querySelector(".loader").textContent = "Product not found.";
    };

    // Initial function call to fetch and display product details
    getProductDetails();

    // Dropdown toggle function
    window.toggleDropdown = (id) => {
        const content = document.getElementById(`${id}-content`);
        const allDropdowns = document.querySelectorAll('.dropdown-content');
        
        allDropdowns.forEach(dropdown => {
            if (dropdown !== content) {
                dropdown.style.display = 'none';
            }
        });

        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    };

    // Size selection logic
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(size => {
        size.addEventListener('click', () => {
            sizeOptions.forEach(s => s.classList.remove('selected'));
            size.classList.add('selected');
        });
    });

    // Button toggle style function
    window.toggleButtonStyle = (button) => {
        const allButtons = document.querySelectorAll('.button');
        allButtons.forEach(btn => {
            if (btn !== button) {
                btn.classList.remove('clicked');
            }
        });
        button.classList.toggle('clicked');
    };
});




document.addEventListener("DOMContentLoaded", function() {
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const category = getUrlParameter('category');
    const productId = parseInt(getUrlParameter('id'));

    const productGrid = document.getElementById("recommended-products");

    if (category) {
        fetch(`./data/${category}.json`)
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                const randomProducts = getRandomProducts(products, productId);
                renderProducts(randomProducts);
            })
            .catch(error => console.error("Error loading products:", error));
    } else {
        console.error("Category parameter not found.");
    }

    // Function to get random products excluding the current product
    const getRandomProducts = (products, currentProductId) => {
        const shuffledProducts = products.sort(() => 0.5 - Math.random()); // Shuffle products array
        const selectedProducts = shuffledProducts.slice(0, 4); // Select first 4 random products

        // Ensure the selected products do not include the current product
        const filteredProducts = selectedProducts.filter(product => product.id !== currentProductId);

        return filteredProducts;
    };

    // Function to render products
    const renderProducts = (products) => {
        productGrid.innerHTML = ''; // Clear previous products

        if (products.length === 0) {
            productGrid.innerHTML = '<p>No similar products available.</p>';
        } else {
            products.forEach(product => {
                const productLink = document.createElement("a");
                productLink.href = `product.html?id=${product.id}&category=${category}`;
                productLink.classList.add("product-card");

                productLink.innerHTML = `
                    <div class="thumbnail-container">
                        <img src="${product.thumbnail}" alt="${product.name}" loading="lazy">
                    </div>
                    <h2>${product.name}</h2>
                    <div class="price-container">
                        <p class="price">₹${product.price.toFixed(2)}</p>
                        <p class="ex-price">₹${product.ex_price.toFixed(2)}</p>
                    </div>
                    <p class="discount">${product.discount_percentage}% off</p>
                    <p class="tags">${product.tags.join(", ")}</p>
                `;
                productGrid.appendChild(productLink);
            });
        }
    };
});







document.addEventListener("DOMContentLoaded", function() {
    
    const shareIcon = document.getElementById('share-icon');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Function to toggle favorite status
    

    // Function to share the product
    const shareProduct = (product) => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this product!',
                text: `Take a look at ${product.name} - it's amazing!`,
                url: window.location.href
            }).catch(error => console.error("Error sharing:", error));
        } else {
            alert('Sharing is not supported on this device.');
        }
    };

    const getProductDetails = () => {
        const category = urlParams.get('category');

        fetch(`./data/${category}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const product = data.products.find(product => product.id === parseInt(productId, 10));
                if (product) {
                    document.title = `${product.name} - SLEEPYSLEVE`;
                    shareIcon.addEventListener('click', () => shareProduct(product));
                    displayProductDetails(product);
                } else {
                    console.error(`Product with id ${productId} not found in category ${category}`);
                    displayErrorMessage();
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
                displayErrorMessage();
            });
    };

    const displayProductDetails = (product) => {
        const images = [product.thumbnail, ...product.images];

        images.forEach((image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.alt = `${product.name} - ${index + 1}`;
            imgElement.classList.add('product-image');
            imgElement.style.transform = `translateX(${index * 100}%)`;
            document.getElementById('image-frame').appendChild(imgElement);

            const indicator = document.createElement('div');
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => showImage(index));
            document.getElementById('image-indicators').appendChild(indicator);
        });

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `₹${product.price.toFixed(2)}`;
        document.getElementById('product-ex-price').textContent = `₹${product.ex_price.toFixed(2)}`;
        document.getElementById('product-discount').textContent = `${product.discount_percentage}% off`;
        document.getElementById('description-content').textContent = product.description;

        const labelsContainer = document.getElementById('product-labels');
        labelsContainer.innerHTML = '';
        for (const label in product.labels) {
            const labelElement = document.createElement('div');
            labelElement.classList.add('product-label');
            labelElement.textContent = `${label}: ${product.labels[label]}`;
            labelsContainer.appendChild(labelElement);
        }

        document.querySelector(".loader").style.display = "none";
    };

    const showImage = (index) => {
        const images = document.querySelectorAll('.product-image');
        images.forEach((img, idx) => {
            img.style.transform = `translateX(${(idx - index) * 100}%)`;
        });

        const indicators = document.querySelectorAll('.image-indicators div');
        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === index);
        });
    };

    const displayErrorMessage = () => {
        document.querySelector(".loader").textContent = "Product not found.";
    };

    getProductDetails();
});












document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const category = urlParams.get('category');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to get the product details and display them
    const getProductDetails = () => {
        fetch(`./data/${category}.json`)
            .then(response => response.json())
            .then(data => {
                const product = data.products.find(product => product.id === parseInt(productId, 10));
                if (product) {
                    displayProductDetails(product);
                } else {
                    console.error(`Product with id ${productId} not found in category ${category}`);
                    displayErrorMessage();
                }
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
                displayErrorMessage();
            });
    };

    // Function to display the product details
    const displayProductDetails = (product) => {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `₹${product.price.toFixed(2)}`;
        document.getElementById('product-ex-price').textContent = `₹${product.ex_price.toFixed(2)}`;
        document.getElementById('product-discount').textContent = `${product.discount_percentage}% off`;
        document.getElementById('description-content').textContent = product.description;

        // Setup the add to cart button
        setupAddToCartButton(product);
    };

    // Function to setup the add to cart button
    const setupAddToCartButton = (product) => {
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const sizeOptions = document.querySelectorAll('.size-option');
        let selectedSize = null;

        sizeOptions.forEach(size => {
            size.addEventListener('click', () => {
                sizeOptions.forEach(s => s.classList.remove('selected'));
                size.classList.add('selected');
                selectedSize = size.textContent;
                addToCartBtn.disabled = false; // Enable the button
                addToCartBtn.classList.add('active'); // Add hover effect
                document.getElementById('size-alert').style.display = 'none'; // Hide the size alert
                updateAddToCartButton(product, selectedSize);
            });
        });

        const updateAddToCartButton = (product, selectedSize) => {
            const cartItem = cart.find(item => item.id === product.id && item.size === selectedSize);
            if (cartItem) {
                renderGoToCartButton();
            } else {
                renderAddToCartButton();
            }
        };

        const renderAddToCartButton = () => {
            addToCartBtn.innerHTML = "Add to Cart";
            addToCartBtn.onclick = () => {
                if (selectedSize) {
                    addToCart(product, selectedSize);
                } else {
                    showSizeAlert(); // Show the size alert
                }
            };
        };

        const renderGoToCartButton = () => {
            addToCartBtn.innerHTML = "BUY NOW";
            addToCartBtn.onclick = () => {
                window.location.href = "/Sleepysleve/v4/cart.html"; // Redirect to the cart page
            };
        };

        const addToCart = (product, size) => {
            const cartItem = cart.find(item => item.id === product.id && item.size === size);
            if (!cartItem) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    thumbnail: product.thumbnail,
                    price: product.price,
                    size: size,
                    category: category, // Ensure category is included
                    quantity: 1
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderGoToCartButton();
        };

        const showSizeAlert = () => {
            const sizeAlert = document.getElementById('size-alert');
            sizeAlert.style.display = 'block'; // Show the size alert
            sizeAlert.style.zIndex = '1000';
            setTimeout(() => {
                sizeAlert.style.display = 'none'; // Hide the alert after 2 seconds
            }, 2000);
        };

        // Check if a size is already selected on page load
        const selectedSizeElement = document.querySelector('.size-option.selected');
        if (selectedSizeElement) {
            selectedSize = selectedSizeElement.textContent;
            updateAddToCartButton(product, selectedSize);
        }

        // Always render the add to cart button initially
        renderAddToCartButton();
    };

    // Function to display error message
    const displayErrorMessage = () => {
        document.querySelector(".loader").textContent = "Product not found.";
    };

    getProductDetails();
});














document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('menu-close');
    const searchIcon = document.querySelector('.search-icon');
    const searchMenu = document.getElementById('search-menu');
    const searchClose = document.getElementById('search-close');

    menuIcon.addEventListener('click', function() {
        mobileMenu.classList.add('visible');
    });

    menuClose.addEventListener('click', function() {
        mobileMenu.classList.remove('visible');
    });

    searchIcon.addEventListener('click', function() {
        searchMenu.classList.add('visible');
    });

    searchClose.addEventListener('click', function() {
        searchMenu.classList.remove('visible');
    });

    // Removed the header transformation code
});

document.addEventListener("DOMContentLoaded", function() {
  // Hide loader wrapper once content is loaded
  document.querySelector(".loader-wrapper").style.display = "none";
});

document.getElementById('cart-icon').addEventListener('click', function() {
      window.location.href = '/Sleepysleve/v4/cart.html';
    });




