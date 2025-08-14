function logURL(requestDetails) {
  if (!requestDetails.url.includes("leetcode")) {
console.log(`Loading: ${requestDetails.url}`);
  return { redirectUrl: "https://leetcode.com/",};
  }
  console.log("nothing to do already on leetcode")
}

browser.webRequest.onBeforeRequest.addListener(logURL, {
  urls: ["<all_urls>"],
},
['blocking']);
