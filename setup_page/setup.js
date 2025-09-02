function createInputElement() {
    console.log('You clicked the button')
    const list = document.getElementById('list')
    const newInput = document.createElement('input')
    newInput.setAttribute('type', 'text')
    newInput.setAttribute('placeholder', 'example.com')
    newInput.setAttribute('id', `website${count}`)
    newInput.setAttribute('name', `website${count}`)
    count++
    list.appendChild(newInput)
}

let count = 0
document.getElementById('addWebsiteButton')
    .addEventListener("click", createInputElement)