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
    displayBlockedWebsite(url)
}

async function displayBlockedWebsite(url) {
    try {
        console.log('adding image')
        const response = await fetch(`https://www.${url}/favicon.ico`)
        const blob = await response.blob()
        let uri = URL.createObjectURL(blob)
        let img = new Image()
        img.src = uri
        const list = document.getElementById("websiteList")
        list.appendChild(img);
    }
    catch(e) {
        console.log("Failed to get favicon", e)
    }
}

document.getElementById("addWebsiteForm")
    .addEventListener("submit", updateLocalStorage)