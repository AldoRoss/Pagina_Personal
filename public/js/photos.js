document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    const navLinks = document.getElementById('nav-links');

    hamburgerBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});