async function redirectUrl(request) {

  // Check if the problem has been solved
  const result = await browser.storage.local.get("lastSolvedProblem")
  const lastSolvedDate = result.lastSolvedProblem
  let date = new Date()
  date.setHours(0, 0, 0, 0)

  // If problem solved continue to original page
  if (lastSolvedDate.getTime() === date.getTime()) {
    console.log("No blocking since you already solved a problem")
    return {}
  }

  // Redirect page if problem is yet to be solved
  else {
    const problemPage = browser.runtime.getURL("redirect_page/SelectProblem.html")
    console.log(problemPage)
    return { redirectUrl: problemPage }
  }
}

function initializeExtension(details) {
  if (details.reason === "install") {
    let date = new Date()
    date.setFullYear(1969) // Super old date so they wont match
    // Create variable to check if leetcode problem has been solved
    browser.storage.local.set({
      lastSolvedProblem: date,
      blocked: []
    })

    // Redirect to the setup page for the extension
    browser.tabs.create({
      url: "setup_page/setup.html"
    })
  }
}

function checkSubmission(request) {
  let filter = browser.webRequest.filterResponseData(request.requestId)
  let decoder = new TextDecoder('utf-8')

  // Handle getting the response object
  filter.ondata = (event) => {
    let stringResponse = decoder.decode(event.data, { stream: true })
    const response = JSON.parse(stringResponse)

    // Once submitted check status code
    if (response.state === 'SUCCESS') {
      if (response.status_code === 10) {
        console.log('problem solved')

        // Update browser storage to reflect solved problem
        let date = new Date()
        date.setHours(0, 0, 0, 0)
        browser.storage.local.set({
          lastSolvedProblem: date
        })
      }
    }
    filter.write(event.data)
  }

  // Handle closting the stream
  filter.onstop = () => {
    filter.close()
  }
}

// Updates the filter array when a website is added or removed
async function updateFilter(changes, area) {

  console.log("updating filter...")
  try {
    const result = await browser.storage.local.get('blocked')
    const blockedUrls = result.blocked
    let filter = []

    // Check if there even are blocked websites
    if ( blockedUrls.length === 0) {
        console.log("Nothing to be blocked...")
        browser.webRequest.onBeforeRequest.removeListener(redirectUrl)
      }

    // Add any new websites to the filter
    else {
      filter = blockedUrls.map((url) => `*://*.${url}/*`)
      browser.webRequest.onBeforeRequest.removeListener(redirectUrl)

      // Create the listener with the new filter.
      browser.webRequest.onBeforeRequest.addListener(redirectUrl, {
        urls: filter,
      },
        ['blocking']);
    }
  } catch (e) {
    console.log("Counldnt fetch local storage", e)
  }
}

// Handle any requests sent when a problem is solved
browser.webRequest.onBeforeRequest.addListener(checkSubmission, {
  urls: ['*://*.leetcode.com/submissions/detail/*/check/'],
},
  ['blocking']);

// Handle the initial setup for the extension
browser.runtime.onInstalled.addListener(initializeExtension)

browser.storage.onChanged.addListener(updateFilter)