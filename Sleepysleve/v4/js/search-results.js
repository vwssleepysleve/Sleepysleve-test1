document.addEventListener("DOMContentLoaded", function() {
  // Get the search query from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("query");

  // Fetch products from JSON files based on categories
  async function fetchProductsFromCategory(category) {
    try {
      const response = await fetch(`/Sleepysleve/v4/data/${category}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${category} products`);
      }
      const data = await response.json();
      return data.products.map(product => ({ ...product, category }));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  // Fetch all products from all categories
  async function fetchAllProducts() {
    const categories = ["polos", "t-shirts", "shirts", "denims", "jackets", "hoodies", "sweatshirts", "sweatpants", "shorts"];
    const allProducts = [];

    for (const category of categories) {
      const products = await fetchProductsFromCategory(category);
      allProducts.push(...products);
    }

    return allProducts;
  }

  // Function to filter products based on the search query
  function filterProducts(products, query) {
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.labels?.category.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // Render the filtered products
  function renderSearchResults(filteredProducts) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (filteredProducts.length === 0) {
      resultsContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    filteredProducts.forEach(product => {
      const discount = product.ex_price - product.price;
      const discountPercentage = product.discount_percentage.toFixed(2);

      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
                <div class="product-thumbnail-container">
                    <img src="${product.thumbnail}" alt="${product.name}" class="product-thumbnail">
                </div>
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-ex-price">₹${product.ex_price.toFixed(2)}</p>
                <p class="product-discount">${discountPercentage}% off</p>
                <p class="product-tag">${product.tags.join(", ")}</p>
            `;

      // Make the entire product card clickable
      productCard.addEventListener("click", function() {
        const url = `/Sleepysleve/v4/product.html?id=${product.id}&category=${product.category}`;
        window.location.href = url;
      });

      resultsContainer.appendChild(productCard);
    });
  }

  // Fetch all products and filter based on the search query
  fetchAllProducts().then(allProducts => {
    const filteredProducts = filterProducts(allProducts, searchQuery);
    renderSearchResults(filteredProducts);
  });
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

    
    document.getElementById('search-button').addEventListener('click', function() {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    window.location.href = `/Sleepysleve/v4/search-results.html?query=${encodeURIComponent(query)}`;
  }
});



