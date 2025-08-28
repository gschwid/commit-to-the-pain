function selectProblem() {
    browser.storage.local.set({ 'generateProblemFlag': true })
    window.location.replace('https://leetcode.com/problems/')
}

document.getElementById("problemButton")
  .addEventListener("click", selectProblem);