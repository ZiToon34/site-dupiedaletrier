const GITHUB_USER = "ZiToon34"
const GITHUB_REPO = "site-dupiedaletrier"
const BRANCH = "main"
const RAW = (path) => `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/${path}?t=${Date.now()}`

function img(filename) {
    return RAW(`images/${filename}`)
}

function set(id, value) {
    const el = document.getElementById(id)
    if (el) el.textContent = value
}

function setSrc(id, filename) {
    const el = document.getElementById(id)
    if (el) el.src = img(filename)
}

function setBg(id, filename) {
    const el = document.getElementById(id)
    if (el) el.style.backgroundImage = `url('${img(filename)}')`
}

function setHref(id, value) {
    const el = document.getElementById(id)
    if (el) el.href = value
}

function getField(fields, id) {
    return fields.find(f => f.id === id)?.value || ''
}

function getSection(data, id) {
    return data.sections.find(s => s.id === id)?.fields || []
}

async function loadCMS() {
    try {
        const res = await fetch(RAW('content.json'))
        const data = await res.json()
        window.CMS_DATA = data
        document.dispatchEvent(new Event('cms:ready'))
    } catch (err) {
        console.warn('CMS non chargé', err)
    }
}

loadCMS()
