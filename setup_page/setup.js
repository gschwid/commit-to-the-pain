async function updateLocalStorage() {
    event.preventDefault()
    const formData = new FormData(document.getElementById("addWebsiteForm"))
    const url = formData.get('website').toLowerCase()
    try {
        const result = await browser.storage.local.get('blocked')
        let blockedUrls = result.blocked

        // Check if the url has been defined.
        if (blockedUrls === undefined) {
            await browser.storage.local.set({
                blocked: [url]
            })
        }

        // Check if form submission already in list
        else if (blockedUrls.includes(url)) {
            console.log("This exists!")
            return
        }

        // Push it into the array
        else {
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

        // Create the HTML image item
        let uri = URL.createObjectURL(blob)
        let img = new Image()
        img.src = uri
        img.height = 30
        img.width = 30

        // Create the text the website will use
        const name = url.split(".", 1)[0]
        console.log(name)
        const listEntry = document.createElement("li")
        listEntry.textContent = name.charAt(0).toUpperCase() + name.slice(1)

        // Put the image and name in their div
        const webDiv = document.createElement("div")
        webDiv.id = "website"
        webDiv.appendChild(img)
        webDiv.appendChild(listEntry)
        
        const list = document.getElementById("websiteList")
        list.appendChild(webDiv);
    }
    catch(e) {
        console.log("Failed to get favicon", e)
    }
}

document.getElementById("addWebsiteForm")
    .addEventListener("submit", updateLocalStorage)