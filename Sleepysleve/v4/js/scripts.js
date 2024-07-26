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

    document.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        const headerBg = document.querySelector('.header-bg');
        const stickyPoint = 50; // Adjust scroll position as needed

        if (window.scrollY > stickyPoint) {
            header.classList.add('sticky');
            headerBg.classList.add('visible');
        } else {
            header.classList.remove('sticky');
            headerBg.classList.remove('visible');
        }
    });
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



