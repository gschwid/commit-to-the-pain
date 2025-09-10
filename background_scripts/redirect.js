function redirectUrl(request) {
    console.log(`Loading: ${request.url}`);
    const problemPage = browser.runtime.getURL("redirect_page/SelectProblem.html")
    console.log(problemPage)
    return { redirectUrl: problemPage }
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
        console.log('rproblem solved')

        // Update browser storage to reflect solved problem
        let date = new Date()
        date.setHours(0,0,0,0)
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
    const result = await browser.storage.local.get(['blocked', 'lastSolvedProblem'])
    const blockedUrls = result.blocked
    const lastSolvedDate = result.lastSolvedProblem
    let filter = []

    // check if problem has been solved
      let date = new Date()
      date.setHours(0, 0, 0, 0)
      console.log(lastSolvedDate, date)
      if (lastSolvedDate.getTime() === date.getTime() || blockedUrls.length === 0) {
        if (lastSolvedDate.getTime() === date.getTime()) {
          console.log("You already solved your problem for the day!")
        }
        else {
          console.log("Nothing in the blocked list")
        }
        browser.webRequest.onBeforeRequest.removeListener(redirectUrl)

      }

    // Need to add a newly addded website to filter
    else if (blockedUrls.length !== 0) {
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
