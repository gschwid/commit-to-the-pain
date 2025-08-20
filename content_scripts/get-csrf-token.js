const allCookiesString = document.cookie
const allCookiesList = allCookiesString.split(';')
for (const cookie of allCookiesList) {
    if (cookie.includes('csrftoken')) {
        browser.storage.local.set({'leetcodeCsrfToken' : cookie.split('=')[1]})
    }
}
