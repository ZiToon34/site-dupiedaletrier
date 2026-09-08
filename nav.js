// NAVBAR SCROLL
// Ajoute la classe "scrolled" des que la page a defile,
// ce qui donne un fond clair a la barre de navigation.
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar')
    if (!navbar) return
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.remove('scrolled')
    }
})

// MENU MOBILE
const toggle = document.getElementById('nav-toggle')
const links = document.getElementById('nav-links')
const navbar = document.getElementById('navbar')

/**
 * Ouvre ou ferme le menu plein ecran.
 * En plus du panneau, on marque #navbar et <body> :
 *  - #navbar.menu-open  : donne a la barre du haut le meme fond creme que
 *    le panneau, sinon le logo reste blanc sur creme et devient illisible
 *  - body.menu-open     : bloque le defilement de la page derriere le menu
 */
function basculerMenu(ouvrir) {
    if (!toggle || !links) return
    const ouvert = ouvrir === undefined ? !links.classList.contains('open') : ouvrir
    toggle.classList.toggle('open', ouvert)
    links.classList.toggle('open', ouvert)
    if (navbar) navbar.classList.toggle('menu-open', ouvert)
    document.body.classList.toggle('menu-open', ouvert)
}

if (toggle && links) {
    toggle.addEventListener('click', () => basculerMenu())

    // Un clic sur un lien ferme le menu
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => basculerMenu(false))
    })

    // La touche Echap ferme le menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') basculerMenu(false)
    })

    // Repasser en grand ecran doit remettre la page dans son etat normal
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) basculerMenu(false)
    })
}

// Active link
// Surligne dans le menu le lien correspondant a la page affichee.
if (links) {
    const file = window.location.pathname.split('/').pop()
    const currentPage = (file === '' || file === 'index.html') ? '/' : file
    links.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href')
        if (href === currentPage) link.classList.add('active')
    })
}
