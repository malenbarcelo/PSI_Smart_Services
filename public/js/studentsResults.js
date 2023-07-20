import { dominio } from "./dominio.js"
import { getData } from "./getData.js"

window.addEventListener('load',async()=>{

    const company = document.getElementById('userLoggedCompany').innerText
    const course = document.getElementById('course').innerText
    const tableRows = document.getElementById('tableRows')
    let filter = 'allData'
    let order = 'noOrder'
    const viewAllData = document.getElementById('viewAllData')
    const viewPassed = document.getElementById('viewPassed')
    const viewNotPassed = document.getElementById('viewNotPassed')
    const tableTitle = document.getElementById('tableTitle')
    const downloadAll = document.getElementById('downloadAll')
    const downloadSelected = document.getElementById('downloadSelected')
    const orderDateAsc = document.getElementById('orderDateAsc')
    const orderDateDesc = document.getElementById('orderDateDesc')
    const orderNameAsc = document.getElementById('orderNameAsc')
    const orderNameDesc = document.getElementById('orderNameDesc')
    const dateFilter = document.getElementById('dateFilter')
    const divDateFilter = document.getElementById('divDateFilter')
    const acceptBtn = document.getElementById('acceptBtn')
    const divError = document.getElementById('divError')
    const formTitle = document.getElementById('formTitle')
    
    //get last 90 days to filter data
    let dateUntil = new Date().getTime() //today as timestamp
    let dateFrom = dateUntil - (90 * 24 * 60 * 60 * 1000) //remove 90 days in millisecs
        
    tableRows.innerHTML = await getData(course,company,filter)
    
    //Add events listeners
    viewPassed.addEventListener("click",async(e)=>{
        
        tableTitle.innerText = 'Aprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.add('underlined')
        viewNotPassed.classList.remove('underlined')
        downloadAll.classList.remove('notVisible')
        downloadSelected.classList.remove('notVisible')
        filter = 'passed'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order)

    })
    viewNotPassed.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Desprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.add('underlined')
        downloadAll.classList.add('notVisible')
        downloadSelected.classList.add('notVisible')
        tableTitle.classList.add('enabled')
        filter = 'notPassed'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order)

    })
    viewAllData.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Todos los resultados'
        viewAllData.classList.add('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.remove('underlined')
        downloadAll.classList.remove('notVisible')
        downloadSelected.classList.remove('notVisible')
        filter = 'allData'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order)
    })
    orderDateAsc.addEventListener("click",async(e)=>{
        order = 'orderDateAsc'
        orderDateAsc.classList.add('notVisible')
        orderDateDesc.classList.remove('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order)
    })
    orderDateDesc.addEventListener("click",async(e)=>{
        order = 'orderDateDesc'
        orderDateAsc.classList.remove('notVisible')
        orderDateDesc.classList.add('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order)
    })
    orderNameAsc.addEventListener("click",async(e)=>{
        order = 'orderNameAsc'
        orderNameAsc.classList.add('notVisible')
        orderNameDesc.classList.remove('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order)
    })
    orderNameDesc.addEventListener("click",async(e)=>{
        order = 'orderNameDesc'
        orderNameAsc.classList.remove('notVisible')
        orderNameDesc.classList.add('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order)
    })
    dateFilter.addEventListener("click",async(e)=>{
        divDateFilter.classList.toggle('notVisible')
    })
    acceptBtn.addEventListener("click",async(e)=>{

        const dateFrom = document.getElementById('dateFrom')
        const dateUntil = document.getElementById('dateUntil')
        
        if (dateFrom.value == '' || dateUntil.value == 'Invalid Date') {
            divError.innerHTML = '<b>!Debe completar las fechas</b>'
        }else{
            if (dateFrom.value > dateUntil.value) {
                divError.innerHTML = '<b>!La fecha "Desde" debe ser menor a la fecha "Hasta"</b>'
            }else{

                divError.innerHTML = ''

                const dateFromArray = dateFrom.value.split('-')
                const dateUntilArray = dateUntil.value.split('-')
                
                const dateFromString = dateFromArray[2] + '/' + dateFromArray[1] + '/' + dateFromArray[0]
                const dateUntilString = dateUntilArray[2] + '/' + dateUntilArray[1] + '/' + dateUntilArray[0]

                formTitle.innerHTML = 'Resultados del formulario (' + dateFromString + ' - ' + dateUntilString + ')'
            }
        }
    })
})