document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const maxChars = 30; // Maximum characters before truncation

    // Function to truncate product name and add ellipsis
    const truncateProductName = (name) => {
        if (name.length > maxChars) {
            return name.substring(0, maxChars) + '...';
        }
        return name;
    };

    // Function to load cart items from local storage
    const loadCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <p id="emptymsg" class="emptymsg">Opps! Your cart is empty...</p>
                <button id="continueShoppingBtn" class="btn btn-primary">Continue Shopping</button>
            `;
            const continueShoppingBtn = document.getElementById('continueShoppingBtn');
            continueShoppingBtn.addEventListener('click', () => {
                history.back(); // Navigate back to previous page
            });
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <div class="cart-thumbnail">
                    <img src="${item.thumbnail}" alt="${item.name}">
                </div>
                <div class="cart-details">
                    <h2>${truncateProductName(item.name)}</h2>
                    <p>Size: ${item.size}</p>
                    <div class="cart-actions">
                        <div class="quantity-controls">
                            <button class="decrement-quantity btn btn-light"><i class="fas fa-minus"></i></button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increment-quantity btn btn-light"><i class="fas fa-plus"></i></button>
                        </div>
                        <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <span class="remove">Remove</span>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);

            // Add event listeners for the increment, decrement, and remove buttons
            cartItem.querySelector('.increment-quantity').addEventListener('click', (event) => {
                event.stopPropagation();
                updateQuantity(item, 1);
            });
            cartItem.querySelector('.decrement-quantity').addEventListener('click', (event) => {
                event.stopPropagation();
                updateQuantity(item, -1);
            });
            cartItem.querySelector('.remove').addEventListener('click', (event) => {
                event.stopPropagation();
                removeItem(item);
            });

            // Add event listener for clicking on the cart item to go to the product page
            cartItem.addEventListener('click', () => {
                window.location.href = `/Sleepysleve/v4/product.html?id=${item.id}&category=${item.category}`;
            });
        });
    };

    // Function to update the quantity of a cart item
    const updateQuantity = (item, change) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItem = cart.find(cartItem => cartItem.id === item.id && cartItem.size === item.size);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                removeItem(cartItem);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    };

    // Function to remove a cart item
    const removeItem = (item) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(cartItem => !(cartItem.id === item.id && cartItem.size === item.size));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    // Function to render the cart
    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        loadCartItems();
    };

    // Load cart items on page load
    loadCartItems();
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
    // Checkout button functionality
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        window.location.href = '/Sleepysleve/v4/checkout.html';
    });



    document.getElementById('search-button').addEventListener('click', function() {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    window.location.href = `/Sleepysleve/v4/search-results.html?query=${encodeURIComponent(query)}`;
  }
});





















