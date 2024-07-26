// loadHeader.js
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;

            // Re-add event listeners after header is loaded
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
        })
        .catch(error => console.error('Error loading header:', error));
}

document.addEventListener('DOMContentLoaded', loadHeader);
