document.addEventListener("DOMContentLoaded", function() {
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const category = getUrlParameter('category');
    const productGrid = document.getElementById("product-grid");
    const pageTitle = document.getElementById("page-title");

    let allProducts = [];

    if (category) {
        pageTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} - Sleepysleve`;
        fetch(`./data/${category}.json`)
            .then(response => response.json())
            .then(data => {
                allProducts = data.products;
                renderProducts(allProducts); // Initial render
            })
            .catch(error => console.error("Error loading products:", error));
    } else {
        pageTitle.textContent = "Category not found - Sleepysleve";
    }

    const filterMenu = document.getElementById('filterMenu');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const filterBtn = document.getElementById('filterBtn');
    const menuClose = document.querySelector('.menu-close');
    let selectedSortOption = '';

    // Open filter menu
    filterBtn.addEventListener('click', function() {
        filterMenu.style.right = '0';
    });

    // Close filter menu
    menuClose.addEventListener('click', function() {
        filterMenu.style.right = '-100%';
    });

    // Apply Filters button click event
    applyFilterBtn.addEventListener('click', function() {
        if (selectedSortOption) {
            const sortedProducts = sortProducts(allProducts, selectedSortOption);
            renderProducts(sortedProducts);
        }
        filterMenu.style.right = '-100%';
    });

    // Clear Filters button click event
    // Clear Filters button click event
clearFilterBtn.addEventListener('click', function() {
    selectedSortOption = '';
    renderProducts(allProducts); // Reset to original order
    filterMenu.style.right = '-100%'; // Close filter menu
});


    // Handle option selection
    document.querySelectorAll('.filter-options .option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.filter-options .option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedSortOption = this.id.replace('sortBy', '').toLowerCase();
        });
    });

    // Function to render products
 // Function to render products
// Intersection Observer to lazy load products
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const productCard = entry.target;
            productCard.classList.add('visible');
            observer.unobserve(productCard);
        }
    });
}, { threshold: 0.1 });

// function to render products
function renderProducts(products) {
    productGrid.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        productGrid.innerHTML = '<p>No products matching the selected criteria.</p>';
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
            observer.observe(productLink); // Observe each product card for lazy loading
        });
    }
}


    // Function to sort products
function sortProducts(products, option) {
    switch (option) {
        case 'featured':
            return products.filter(product => product.filter.includes('featured'));
        case 'bestselling':
            return products.filter(product => product.filter.includes('best selling'));
        case 'titleaz':
            return products.sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);
        case 'titleza':
            return products.sort((a, b) => b.name.localeCompare(a.name) || a.id - b.id);
        case 'pricelowhigh':
            return products.sort((a, b) => a.price - b.price || a.id - b.id);
        case 'pricehighlow':
            return products.sort((a, b) => b.price - a.price || a.id - b.id);
        case 'datenewold':
            return products.sort((a, b) => new Date(b.date_added) - new Date(a.date_added) || a.id - b.id);
        case 'dateoldnew':
            return products.sort((a, b) => new Date(a.date_added) - new Date(b.date_added) || a.id - b.id);
        default:
            return products;
    }
}

});

document.addEventListener("DOMContentLoaded", function() {
  // Hide loader wrapper once content is loaded
  document.querySelector(".loader-wrapper").style.display = "none";
});

 document.getElementById('cart-icon').addEventListener('click', function() {
      window.location.href = '/Sleepysleve/v4/cart.html';
    });