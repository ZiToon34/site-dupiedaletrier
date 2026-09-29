/* =========================================================
   Visionneuse photo — Du Pied à l'Étrier
   Fonctionne sur la galerie de l'accueil, sur les sections
   "En images" des pages d'activités et sur les galeries
   d'événements de la page Actualités, y compris pour les photos
   ajoutées depuis Mon CMS (délégation d'évènements).
   ========================================================= */
(function () {
    'use strict'

    // Les galeries d'evenements (page Actualites) sont aussi prises en charge
    var SELECTOR = '.gallery-strip-grid img, .photo-grid img, .actu-galerie img'
    var GROUPES = '.gallery-strip-grid, .photo-grid, .actu-galerie'

    // ---------- Construction de la visionneuse ----------
    var box = document.createElement('div')
    box.className = 'lightbox'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-modal', 'true')
    box.setAttribute('aria-label', 'Photo en grand format')
    box.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Fermer">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Photo précédente">&#8249;</button>' +
        '<div class="lightbox-stage">' +
            '<img class="lightbox-img" alt="">' +
            '<p class="lightbox-caption"></p>' +
        '</div>' +
        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Photo suivante">&#8250;</button>'
    document.body.appendChild(box)

    var imgEl = box.querySelector('.lightbox-img')
    var capEl = box.querySelector('.lightbox-caption')
    var navEls = box.querySelectorAll('.lightbox-nav')
    var closeEl = box.querySelector('.lightbox-close')

    var items = []
    var index = 0
    var lastFocus = null

    // ---------- Rendre les photos cliquables au clavier ----------
    function enhance() {
        var list = document.querySelectorAll(SELECTOR)
        for (var i = 0; i < list.length; i++) {
            var im = list[i]
            if (im.dataset.lbReady) continue
            im.dataset.lbReady = '1'
            im.setAttribute('role', 'button')
            im.setAttribute('tabindex', '0')
        }
    }

    // ---------- Affichage ----------
    function show(i) {
        if (!items.length) return
        index = (i + items.length) % items.length
        var src = items[index]
        imgEl.src = src.currentSrc || src.src
        imgEl.alt = src.alt || ''
        capEl.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : ''
        for (var n = 0; n < navEls.length; n++) {
            navEls[n].style.display = items.length > 1 ? '' : 'none'
        }
    }

    function open(target) {
        // Chaque evenement forme son propre groupe : les fleches
        // parcourent ses photos, sans passer a l'evenement suivant
        var grid = target.closest(GROUPES)
        items = grid ? Array.prototype.slice.call(grid.querySelectorAll('img')) : [target]
        lastFocus = document.activeElement
        show(items.indexOf(target))
        box.classList.add('open')
        document.body.classList.add('lightbox-open')
        closeEl.focus()
    }

    function close() {
        box.classList.remove('open')
        document.body.classList.remove('lightbox-open')
        imgEl.removeAttribute('src')
        if (lastFocus && lastFocus.focus) lastFocus.focus()
    }

    // ---------- Ouverture (souris) ----------
    document.addEventListener('click', function (e) {
        if (!e.target.closest) return
        var t = e.target.closest(SELECTOR)
        if (t) { e.preventDefault(); open(t) }
    })

    // ---------- Ouverture (clavier) ----------
    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') &&
            e.target.matches && e.target.matches(SELECTOR)) {
            e.preventDefault()
            open(e.target)
        }
    })

    // ---------- Fermeture ----------
    closeEl.addEventListener('click', close)
    box.addEventListener('click', function (e) {
        // clic en dehors de l'image
        if (e.target === box || e.target.classList.contains('lightbox-stage')) close()
    })

    // ---------- Navigation ----------
    box.querySelector('.lightbox-prev').addEventListener('click', function (e) {
        e.stopPropagation(); show(index - 1)
    })
    box.querySelector('.lightbox-next').addEventListener('click', function (e) {
        e.stopPropagation(); show(index + 1)
    })

    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('open')) return
        if (e.key === 'Escape') close()
        else if (e.key === 'ArrowLeft') show(index - 1)
        else if (e.key === 'ArrowRight') show(index + 1)
    })

    // ---------- Balayage tactile ----------
    var startX = null
    box.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].clientX
    }, { passive: true })
    box.addEventListener('touchend', function (e) {
        if (startX === null) return
        var dx = e.changedTouches[0].clientX - startX
        if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1)
        startX = null
    }, { passive: true })

    // ---------- Initialisation ----------
    enhance()
    // les galeries des pages d'activités sont remplies par Mon CMS
    document.addEventListener('cms:ready', function () { setTimeout(enhance, 50) })
})()
