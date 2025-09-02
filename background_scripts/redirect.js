function redirectUrl(request) {
  if (!request.url.includes("leetcode")) {
    console.log(`Loading: ${request.url}`);
    const problemPage = browser.runtime.getURL("redirect_page/SelectProblem.html")
    console.log(problemPage)
    return { redirectUrl: problemPage}
  }
  console.log("nothing to do already on leetcode")
}

function initializeExtension() {
  console.log("this is a test")
  browser.tabs.create({
    url: "setup_page/setup.html"
  })
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
        console.log('Congrats! You submitted the problem')
      }
      else {
        console.log(":( you are a noob")
        console.log(getRandomProblem('EASY'))
      }
    }
    filter.write(event.data)
  }

  // Handle closting the stream
  filter.onstop = () => {
    filter.close()
  }
}

// Block any of the added websites before leetcode problem is solved
browser.webRequest.onBeforeRequest.addListener(redirectUrl, {
  urls: ['*://*.youtube.com/*'],
},
  ['blocking']);

// Handle any requests sent when a problem is solved
browser.webRequest.onBeforeRequest.addListener(checkSubmission, {
  urls: ['*://*.leetcode.com/submissions/detail/*/check/'],
},
  ['blocking']);

// Handle the initial setup for the extension
browser.runtime.onInstalled.addListener(initializeExtension)
