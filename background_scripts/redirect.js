function redirectUrl(request) {
  if (!request.url.includes("leetcode")) {
    console.log(`Loading: ${request.url}`);
    return { redirectUrl: "https://leetcode.com/", };
  }
  console.log("nothing to do already on leetcode")
}

async function getRandomProblem(difficulty) {
  let csrfToken = ''
  try {
    let result = await browser.storage.local.get('leetcodeCsrfToken')
    csrfToken = result.leetcodeCsrfToken
  } catch (e) {
    console.log("Failed to get CSRF token", e)
  }
  console.log('this is the token', csrfToken)

  const query = `
  query {
    randomQuestionV2(
      filters: {
        premiumFilter: { premiumStatus: [PREMIUM], operator: IS_NOT }
        difficultyFilter: {difficulties:[${difficulty}], operator: IS}
      }
    ) {
      categorySlug	"all-code-essentials"
      }
    }`
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
        'x-csrftoken': csrfToken,
        "Referer": "https://leetcode.com/problemset/",
      },
      credentials: "include"
    })
    console.log(response)
  } catch (e) {
    console.log(`Error generating random problem: ${e}`)
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

// Handle any requests sent when a problem is solved
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    console.log("Intercepted request:", details);
  },
  { urls: ["https://leetcode.com/graphql/"] },
  ["requestHeaders"]
);