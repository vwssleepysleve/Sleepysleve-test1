document.addEventListener("DOMContentLoaded", function() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const totalAmountContainer = document.getElementById('summaryTotal');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const paymentDoneButton = document.getElementById('paymentDoneButton');
    const promoInput = document.getElementById('promoInput');
    const applyPromoButton = document.getElementById('applyPromoButton');
    const promoMessage = document.getElementById('promoMessage');
    const summaryDiscount = document.getElementById('summaryDiscount');
    const summarySavings = document.getElementById('summarySavings');
    const summaryOriginal = document.getElementById('summaryOriginal');
    const summaryDelivery = document.getElementById('summaryDelivery');
    const orderSummarySection = document.getElementById('orderSummary');
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');
    const errorMessages = {
        name: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        phone: document.getElementById('phoneError'),
        streetAddress: document.getElementById('streetAddressError'),
        city: document.getElementById('cityError'),
        state: document.getElementById('stateError'),
        postalCode: document.getElementById('postalCodeError'),
        country: document.getElementById('countryError'),
        FACE: document.getElementById('FACEError'),
        payment: document.getElementById('paymentError')
    };

    const deliveryCharge = 49;
    let originalAmount = 0;
    let totalAmount = 0;
    let appliedCoupon = '';
    let discountAmount = 0;

    const loadCheckoutItems = () => {
        const checkoutCart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
        
        if (checkoutCart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        checkoutCart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.classList.add('checkout-item');

            checkoutItem.innerHTML = `
                <span class="product-name" data-link="/Sleepysleve/v4/product.html?id=${item.id}&category=${item.category}">${item.name} (Size: ${item.size})</span>
                <span>${item.quantity} x ₹${item.price.toFixed(2)}</span>
            `;

            checkoutItemsContainer.appendChild(checkoutItem);
            originalAmount += item.price * item.quantity;

            checkoutItem.querySelector('.product-name').addEventListener('click', (event) => {
                const link = event.target.getAttribute('data-link');
                window.location.href = link;
            });
        });

        totalAmount = originalAmount + deliveryCharge;
        summaryOriginal.innerHTML = `Original Total: ₹${originalAmount.toFixed(2)}`;
        summaryDelivery.innerHTML = `Delivery Charge: ₹${deliveryCharge.toFixed(2)}`;
        totalAmountContainer.textContent = `Total: ₹${totalAmount.toFixed(2)}`;
    };

    const applyPromoCode = async () => {
        const promoCode = promoInput.value.trim();
        const response = await fetch('/Sleepysleve/v4/data/Cupons/Cupons.json');
        const coupons = await response.json();
        const coupon = coupons.find(c => c.code === promoCode);

        if (!coupon) {
            promoMessage.textContent = "Invalid promo code.";
            promoMessage.style.color = "red";
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (currentDate > coupon.expiryDate) {
            promoMessage.textContent = "Promo code has expired.";
            promoMessage.style.color = "red";
            return;
        }

        if (totalAmount < coupon.minimumAmount) {
            promoMessage.textContent = `Minimum amount of ₹${coupon.minimumAmount} is required to apply this promo code.`;
            promoMessage.style.color = "red";
            return;
        }

        discountAmount = originalAmount * (coupon.discountPercentage / 100);
        totalAmount = originalAmount - discountAmount + deliveryCharge;
        appliedCoupon = coupon.code;

        totalAmountContainer.innerHTML = `Total: ₹${totalAmount.toFixed(2)}`;
        summaryDiscount.innerHTML = `Discount (${coupon.discountPercentage}%): -₹${discountAmount.toFixed(2)}`;
        summarySavings.innerHTML = `You saved: ₹${discountAmount.toFixed(2)}`;
        promoMessage.innerHTML = `Promo applied successfully!`;
        promoMessage.style.color = "#22FF44";

        orderSummarySection.scrollIntoView({ behavior: 'smooth' });
    };

    applyPromoButton.addEventListener('click', applyPromoCode);

    const setErrorMessage = (input, message) => {
        const errorElement = errorMessages[input.name];
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    };

    const clearErrorMessage = (input) => {
        const errorElement = errorMessages[input.name];
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    };

    const validateForm = () => {
        let isValid = true;

        [...shippingForm.elements].forEach(input => {
            if (input.required) {
                clearErrorMessage(input);
                if (!input.value.trim()) {
                    setErrorMessage(input, `Please fill out this field.`);
                    isValid = false;
                } else if (input.name === 'phone' && !/^\+?[0-9]{10,14}$/.test(input.value.trim())) {
                    setErrorMessage(input, `Please enter a valid phone number.`);
                    isValid = false;
                } else if (input.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                    setErrorMessage(input, `Please include an '@' in the email address.`);
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            document.getElementById('shippingDetails').scrollIntoView({ behavior: 'smooth' });
        }

        return isValid;
    };

    const generateUPIUrl = (upiId, name, amount, transactionId, description, app) => {
        switch (app) {
            case 'googlepay':
            case 'phonepe':
            case 'bhim':
            case 'amazonpay':
            case 'mobikwik':
                return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&mc=0000&tid=${encodeURIComponent(transactionId)}&tr=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(description)}&am=${encodeURIComponent(amount)}&cu=INR&url=`;
            case 'paytm':
                return `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&tid=${encodeURIComponent(transactionId)}&tr=${encodeURIComponent(transactionId)}&tn=${encodeURIComponent(description)}&am=${encodeURIComponent(amount)}&cu=INR`;
            case 'whatsapppay':
                return null; // WhatsApp Pay might use a different URL scheme or not support direct link
            default:
                return null;
        }
    };

    const formatOrderDetails = (orderDetails) => {
        return `
        *Shipping Details:*
        Name: ${orderDetails.shippingDetails.name}
        Email: ${orderDetails.shippingDetails.email}
        Phone: ${orderDetails.shippingDetails.phone}
        Address: ${orderDetails.shippingDetails.streetAddress}, ${orderDetails.shippingDetails.city}, ${orderDetails.shippingDetails.state}, ${orderDetails.shippingDetails.postalCode}, ${orderDetails.shippingDetails.country}

        *Ordered Products:*
        ${orderDetails.orderedProducts.map(product => `
        - ${product.name} (Size: ${product.size}) x ${product.quantity} @ ₹${product.price.toFixed(2)}
          Product Link: ${product.link}
          Thumbnail: ${product.thumbnail}
        `).join('\n')}

        *IP Details:*
        IP Address: ${orderDetails.ipAddress}
        City: ${orderDetails.userCity}
        Region: ${orderDetails.userRegion}
        Country: ${orderDetails.userCountry}
        Postal Code: ${orderDetails.userPostal}

        *Order Summary:*
        Original Amount: ₹${orderDetails.finalSummary.originalAmount}
        Discount: -₹${orderDetails.finalSummary.discountAmount}
        Delivery Charge: ₹${orderDetails.finalSummary.deliveryCharge}
        Total Amount: ₹${orderDetails.finalSummary.totalAmount}
        Applied Coupon: ${orderDetails.finalSummary.appliedCoupon}

        *Verification Code:* ${orderDetails.verificationCode}
        `;
    };

    const sendOrderDetailsToTelegram = async (orderDetails) => {
        const telegramBotToken = '7238516998:AAHhqLuzmtHvJImXKhyfOMYYUObRPE7Hx1w'; // Replace with your bot token
        const chatId = '-1002237306649'; // Replace with your chat ID
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        try {
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: formatOrderDetails(orderDetails),
                    parse_mode: 'Markdown' // Use Markdown formatting
                })
            });

            if (response.ok) {
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to send message to Telegram: ${errorData.description}`);
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    const getIPGeolocation = async () => {
        try {
            const ipResponse = await fetch('https://ipinfo.io/json');
            return await ipResponse.json();
        } catch (error) {
            console.error('Error fetching IP geolocation:', error);
            return {
                ip: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                country: 'Unknown',
                postal: 'Unknown'
            };
        }
    };

    const handlePlaceOrder = async (redirectUrl) => {
        if (validateForm()) {
            // nShow the Telegram loader while sending details
            document.querySelector(".telegram-loader-wrapper").style.display = "flex";

            let ipGeolocation = await getIPGeolocation();

            const orderDetails = {
                shippingDetails: {
                    name: shippingForm.elements['name'].value,
                    email: shippingForm.elements['email'].value,
                    phone: shippingForm.elements['phone'].value,
                    streetAddress: shippingForm.elements['streetAddress'].value,
                    city: shippingForm.elements['city'].value,
                    state: shippingForm.elements['state'].value,
                    postalCode: shippingForm.elements['postalCode'].value,
                    country: shippingForm.elements['country'].value
                },
                orderedProducts: JSON.parse(localStorage.getItem('checkoutCart')).map(item => ({
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    link: `/Sleepysleve/v4/product.html?id=${item.id}&category=${item.category}`,
                    thumbnail: item.thumbnail
                })),
                ipAddress: ipGeolocation.ip,
                userCity: ipGeolocation.city,
                userRegion: ipGeolocation.region,
                userCountry: ipGeolocation.country,
                userPostal: ipGeolocation.postal,
                verificationCode: Math.floor(100000 + Math.random() * 900000), // 6-digit verification code
                finalSummary: {
                    originalAmount: originalAmount.toFixed(2),
                    discountAmount: discountAmount.toFixed(2),
                    deliveryCharge: deliveryCharge.toFixed(2),
                    totalAmount: totalAmount.toFixed(2),
                    appliedCoupon: appliedCoupon
                }
            };

            const messageSent = await sendOrderDetailsToTelegram(orderDetails);

            if (messageSent) {
                // Hide the Telegram loader
                document.querySelector(".telegram-loader-wrapper").style.display = "none";
                // Redirect to the provided URL (payment app or confirmation page)
                        // Redirect to the provided URL (payment app or confirmation page)
                      window.location.href = redirectUrl;
                    } else {
                      showCustomPopup('Failed to send order details. Please try again later.', true);
                      // Hide the Telegram loader
                      document.querySelector(".telegram-loader-wrapper").style.display = "none";
                    

                    }
                    }
                    };
                    
                    placeOrderButton.addEventListener('click', async (event) => {
                      event.preventDefault();
                    
                      const selectedUPIApp = document.getElementById('upiApp').value;
                      const upiId = 'example@upi'; // Replace with the actual UPI ID
                      const name = shippingForm.elements['name'].value;
                      const description = 'Order Payment';
                      const transactionId = Date.now().toString();
                    
                      const upiUrl = generateUPIUrl(upiId, name, totalAmount.toFixed(2), transactionId, description, selectedUPIApp);
                    
                      if (upiUrl) {
                        await handlePlaceOrder(upiUrl);
                      } else {
                        showCustomPopup('Failed to generate UPI URL. Please try again later.', true);
                      }
                    });

    placeOrderButton.addEventListener('click', () => {
        const selectedUPIApp = document.querySelector('input[name="upiApp"]:checked');

        if (!selectedUPIApp) {
            errorMessages.payment.textContent = 'Please select a payment app.';
            errorMessages.payment.style.display = 'block';
            return;
        }

        const upiId = 'sarvaiyakishorbhai9820@okhdfcbank'; // Replace with your UPI ID
        const name = 'Your Name'; // Replace with your name or merchant name
        const amount = totalAmount.toFixed(2);
        const transactionId = 'TXN' + new Date().getTime(); // Unique transaction ID
        const description = 'Order Payment'; // Description of the payment
        const appValue = selectedUPIApp.value;
        const upiUrl = generateUPIUrl(upiId, name, amount, transactionId, description, appValue);

        if (upiUrl) {
            handlePlaceOrder(upiUrl);
        } else {
            errorMessages.payment.textContent = 'Error generating payment URL.';
            errorMessages.payment.style.display = 'block';
        }
    });

    paymentDoneButton.addEventListener('click', () => {
        handlePlaceOrder('/Sleepysleve/v4/conformation.html'); // Replace with the actual URL of the order confirmation page
    });

    // Toggle dropdowns and close others when one is opened
    document.querySelectorAll('.dropdown-toggle').forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', function(event) {
            const targetDropdownMenu = this.nextElementSibling;

            document.querySelectorAll('.dropdown-menu').forEach(dropdownMenu => {
                if (dropdownMenu !== targetDropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
            });

            targetDropdownMenu.classList.toggle('show');
        });
    });

    // Prevent dropdown from closing when selecting an option
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    // Close dropdowns if clicked outside
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown-menu')) {
            document.querySelectorAll('.dropdown-menu').forEach(dropdownMenu => {
                dropdownMenu.classList.remove('show');
            });
        }
    });

    // Close dropdowns on form submit to avoid re-submission issues
    shippingForm.addEventListener('submit', function() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdownMenu => {
            dropdownMenu.classList.remove('show');
        });
    });

    paymentForm.addEventListener('submit', function() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdownMenu => {
            dropdownMenu.classList.remove('show');
        });
    });

    loadCheckoutItems();
});

document.addEventListener("DOMContentLoaded", function() {
    // Hide main loader wrapper once content is loaded
    document.querySelector(".loader-wrapper").style.display = "none";
});





document.addEventListener('DOMContentLoaded', () => {
  const confirmOrderBtn = document.getElementById('confirm-order-btn');

  confirmOrderBtn.addEventListener('click', () => {
    window.location.href = '/Sleepysleve/v4/conformation.html'; // Update this with your actual confirmation page URL
  });
});





