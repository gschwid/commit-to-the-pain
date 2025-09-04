


async function updateLocalStorage() {
    event.preventDefault()
    const formData = new FormData(document.getElementById("addWebsiteForm"))
    const url = formData.get('website')
    try {
        const result = await browser.storage.local.get('blocked')
        let blockedUrls = result.blocked
        if (blockedUrls === undefined) {
            await browser.storage.local.set({
                blocked: [url]
            })
        } else {
            blockedUrls.push(url)
            await browser.storage.local.set({
                blocked: blockedUrls
            })
        }
    } catch (e) {
        console.error("Could not fetch browser storage", e)
    }
}

document.getElementById("addWebsiteForm")
    .addEventListener("submit", updateLocalStorage)