async function updateLocalStorage() {
    event.preventDefault()
    const formData = new FormData(document.getElementById("addWebsiteForm"))
    const url = formData.get('website').toLowerCase()
    try {
        const result = await browser.storage.local.get('blocked')
        let blockedUrls = result.blocked

        // Check if form submission already in list
        if (blockedUrls.includes(url)) {
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
        const listEntry = document.createElement("li")
        listEntry.textContent = name.charAt(0).toUpperCase() + name.slice(1)

        // Put the image and name in their div
        const webDiv = document.createElement("div")
        webDiv.id = url
        webDiv.appendChild(img)
        webDiv.appendChild(listEntry)

        // Put a delete button
        const deleteButton = document.createElement("button")
        deleteButton.onclick = deleteWebsite
        deleteButton.name = url
        webDiv.appendChild(deleteButton)
        
        const list = document.getElementById("websiteList")
        list.appendChild(webDiv);
    }
    catch(e) {
        console.log("Failed to get favicon", e)
    }
}

async function deleteWebsite(event) {
    const divId = event.target.name
    document.getElementById(divId).remove()

    try {
        const result = await browser.storage.local.get('blocked')
        let newUrls = result.blocked
        console.log(newUrls)
        newUrls = newUrls.filter(url => url != divId)
        await browser.storage.local.set({
                blocked: newUrls
            })

    } catch(e) {
        console.error("Could not fetch browser storage", e)
    }
    const result = await browser.storage.local.get('blocked')
    let blockedUrls = result.blocked
    console.log(blockedUrls)
}   

document.getElementById("addWebsiteForm")
    .addEventListener("submit", updateLocalStorage)