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
            const randomProblemObject = await response.json()
            const randomProblem = randomProblemObject.data.randomQuestionV2.titleSlug

            // Load the randomly generated problem
            browser.storage.local.set({ 'generateProblemFlag': false })
            window.location.replace(`https://leetcode.com/problems/${randomProblem}/description`)

        } catch (e) {
            console.log(`Error generating random problem: ${e}`)
        }
    }
}

checkRandomProblemFlag().then(handleProblemGeneration)

// Need to consider how to handle the situation when a user is not signed in, that will be tricky.