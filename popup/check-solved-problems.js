function resetSolved() {
    let date = new Date()
    date.setFullYear(1969) // Super old date so they wont match
  // Create variable to check if leetcode problem has been solved
  browser.storage.local.set({
    lastSolvedProblem: date,
  })
}

document.getElementById("reset").addEventListener("clicked", resetSolved)