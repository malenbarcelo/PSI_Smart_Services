function closePopupsEventListeners(closePopups) {
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })
}

function isInvalid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.add('invalidInput')
        if (label) {
            label.classList.add('invalidLabel')
        }
        if (error) {
            error.style.display = 'block'
        }
        
    })    
}

function isValid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.remove('invalidInput')
        if (label) {
            label.classList.remove('invalidLabel')
        }
        
        if (error) {
            error.style.display = 'none'
        }
    })    
}

function acceptWithEnter(input,button) {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            button.click()
        }
    })
}

function dateToString(date) {

    const dateWithoutTime = date.split('T')[0]
    const dateAsArray = dateWithoutTime.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '/' + month + '/' + year

    return stringDate    
}

function clearInputs(inputs) {
    inputs.forEach(input => {
        if (input) {
            input.value = ''
        }
    })
}

export {closePopupsEventListeners,isInvalid,isValid, acceptWithEnter,dateToString, clearInputs}