// Function to generate random number less than 6
function getRandomNumber() {
    return Math.floor(Math.random() * 6);
}

// Function to generate and display the math question
function generateMathQuestion() {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;
    return num1 + num2;
}

let correctAnswer = generateMathQuestion();

// Function to show custom popup
function showCustomPopup(message, isError = false) {
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    popup.textContent = message;
    if (isError) {
        popup.classList.add('error');
    } else {
        popup.classList.add('success');
    }
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('show');
    }, 10);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }, 3000);
}

// Function to format Telegram message
function formatTelegramMessage(userDetails) {
    return `
        New user details:
        Name: ${userDetails.name}
        Email: ${userDetails.email}
        Phone: ${userDetails.phone}
        Instagram: ${userDetails.instagram}
        Street Address: ${userDetails.streetAddress}
        Landmark: ${userDetails.landmark}
        City: ${userDetails.city}
        State/Province: ${userDetails.state}
        Postal Code: ${userDetails.postalCode}
        Country: ${userDetails.country}
        IP Address: ${userDetails.ipAddress}
        City: ${userDetails.userCity}
        Region: ${userDetails.userRegion}
        Country: ${userDetails.userCountry}
        Postal: ${userDetails.userPostal}
    `;
}

// Function to send message to Telegram
async function sendTelegramMessage(message) {
    const botToken = '7466334322:AAEohfY6t7ajY4R8tDVc_Wa71cuCELcXMVM'; // Replace with your Telegram bot token
    const chatId = '-1002212122385'; // Replace with your Telegram chat ID

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        const data = await response.json();
        console.log('Telegram Response:', data);

        if (!data.ok) {
            throw new Error('Failed to send message to Telegram');
        }

        showCustomPopup('Details saved successfully!', false);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        showCustomPopup('Failed to send user details to Telegram.', true);
    }
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const userDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        instagram: document.getElementById('instagram').value,
        streetAddress: document.getElementById('streetAddress').value,
        landmark: document.getElementById('landmark').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
    };

    const userMathAnswer = parseInt(document.getElementById('mathAnswer').value, 10);
    if (userMathAnswer !== correctAnswer) {
        showCustomPopup('Oops! Verification failed. Please try again.', true);
        return;
    }

    // Display loader while processing
    document.getElementById('loader').style.display = 'block';

    try {
        let ipGeolocation;
        try {
            const ipResponse = await fetch('https://ipinfo.io/json');
            ipGeolocation = await ipResponse.json();
            console.log('IP Geolocation:', ipGeolocation);
        } catch (ipError) {
            console.error('Error fetching IP geolocation:', ipError);
            showCustomPopup('Failed to fetch IP details. Please try again later.', true);
            document.getElementById('loader').style.display = 'none';
            return;
        }

        if (ipGeolocation) {
            userDetails.ipAddress = ipGeolocation.ip;
            userDetails.userCity = ipGeolocation.city;
            userDetails.userRegion = ipGeolocation.region;
            userDetails.userCountry = ipGeolocation.country;
            userDetails.userPostal = ipGeolocation.postal;
        } else {
            userDetails.ipAddress = 'Unknown';
            userDetails.userCity = 'Unknown';
            userDetails.userRegion = 'Unknown';
            userDetails.userCountry = 'Unknown';
            userDetails.userPostal = 'Unknown';
        }

        // Save user details in local storage
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        // Send user details to Telegram
        const message = formatTelegramMessage(userDetails);
        await sendTelegramMessage(message);

        // Hide loader after processing
        document.getElementById('loader').style.display = 'none';

        // Display saved user details
        displayUserDetails();
    } catch (error) {
        console.error('Error processing form:', error);
        showCustomPopup('Failed to process user details. Please try again later.', true);

        // Hide loader on error
        document.getElementById('loader').style.display = 'none';
    }
}

// Function to display saved user details
function displayUserDetails() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
        const userDetailsDiv = document.getElementById('userDetails');
        userDetailsDiv.innerHTML = `
            <h3>Your Details:</h3>
            <p><strong>Name:</strong> ${userDetails.name}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            <p><strong>Phone:</strong> ${userDetails.phone}</p>
            <p><strong>Instagram:</strong> ${userDetails.instagram}</p>
            <p><strong>Street Address:</strong> ${userDetails.streetAddress}</p>
            <p><strong>Landmark:</strong> ${userDetails.landmark}</p>
            <p><strong>City:</strong> ${userDetails.city}</p>
            <p><strong>State/Province:</strong> ${userDetails.state}</p>
            <p><strong>Postal Code:</strong> ${userDetails.postalCode}</p>
            <p><strong>Country:</strong> ${userDetails.country}</p>
        `;
        document.getElementById('editIcon').style.display = 'block';
        document.getElementById('userForm').style.display = 'none';
        userDetailsDiv.style.display = 'block';
    } else {
        document.getElementById('userForm').style.display = 'block';
    }
}

// Event listener for edit icon
document.getElementById('editIcon').addEventListener('click', function () {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
        document.getElementById('name').value = userDetails.name;
        document.getElementById('email').value = userDetails.email;
        document.getElementById('phone').value = userDetails.phone;
        document.getElementById('instagram').value = userDetails.instagram;
        document.getElementById('streetAddress').value = userDetails.streetAddress;
        document.getElementById('landmark').value = userDetails.landmark;
        document.getElementById('city').value = userDetails.city;
        document.getElementById('state').value = userDetails.state;
        document.getElementById('postalCode').value = userDetails.postalCode;
        document.getElementById('country').value = userDetails.country;
    }

    document.getElementById('userForm').style.display = 'block';
    document.getElementById('userDetails').style.display = 'none';
});

// Initialize form on page load
window.onload = function () {
    correctAnswer = generateMathQuestion();
    displayUserDetails();
};

// Attach event listener to form submission
document.getElementById('userForm').addEventListener('submit', handleFormSubmit);