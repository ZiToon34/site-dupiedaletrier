// NAVBAR SCROLL
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar')
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.remove('scrolled')
    }
})

// MENU MOBILE
const toggle = document.getElementById('nav-toggle')
const links = document.getElementById('nav-links')

toggle.addEventListener('click', () => {
    toggle.classList.toggle('open')
    links.classList.toggle('open')
})

links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        toggle.classList.remove('open')
        links.classList.remove('open')
    })
})

// Active link
const currentPage = window.location.pathname.split('/').pop() || 'index.html'
links.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPage) link.classList.add('active')
})
