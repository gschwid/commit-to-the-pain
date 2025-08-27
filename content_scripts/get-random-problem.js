// Checks if we are trying to generate a random problem
async function checkRandomProblemFlag() {
    let result = await browser.storage.local.get('generateProblemFlag')
    return result
}

async function handleProblemGeneration(result) {
    const generateProblemFlag = result.generateProblemFlag
    if (generateProblemFlag) {

        // Get cookie from webpage 
        const allCookiesList = document.cookie.split(';')
        let leetcodeCsrfToken = ''
        for (const cookie of allCookiesList) {
            if (cookie.includes('csrftoken')) {
                leetcodeCsrfToken = cookie.split('=')[1]
            }
        }

        // Define query to send the backend
        const difficulty = "EASY"
        const query = `
        query {
            randomQuestionV2(
            filtersV2: {
                filterCombineType: ALL
                premiumFilter: { premiumStatus: [PREMIUM], operator: IS_NOT }
                difficultyFilter: {difficulties:[${difficulty}], operator: IS}
            }
            ) {
            titleSlug
            }
        }`

        // Try to send the query
        try {
            const response = await content.fetch("https://leetcode.com/graphql/", {
                method: "POST",
                body: JSON.stringify({ query }),
                headers: {
                    "Content-Type": "application/json",
                    'x-csrftoken': leetcodeCsrfToken,
                },
            })
            const randomProblem = await response.json()
            console.log(randomProblem)
        } catch (e) {
            console.log(`Error generating random problem: ${e}`)
        }
    }
}

// TODO: set this somehow in the background script
browser.storage.local.set({ 'generateProblemFlag': true })
checkRandomProblemFlag().then(handleProblemGeneration)


// new plan
// set a flag when you redirect to leetcode to generate a random problem
// in this script, check for the flag, then send the query from the website so it allows to get user info
// set the flag to false, then redirect to the random problem. 

// Need to consider how to handle the situation when a user is not signed in, that will be tricky.