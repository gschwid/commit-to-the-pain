function updateLocalStorage(result) {
    let blocked = result.blocked
    if (blocked === undefined) {
        console.log("bru")
    }
}

async function displayWebsite() {
    event.preventDefault()
    const formData = new FormData(document.getElementById("addWebsiteForm"))
    const url = formData.get('website')
    const result = await browser.storage.local.get('blocked')
    let blockedUrls = result.blocked
    if (blockedUrls === undefined) {
        browser.storage.local.set({
            blocked: [url]
        })
    } else {
        blockedUrls.push(url)
        browser.storage.local.set({
            blocked: blockedUrls
        })
    }

    const updated = await browser.storage.local.get('blocked')
    console.log(updated)
}

document.getElementById("addWebsiteForm")
    .addEventListener("submit", displayWebsite)