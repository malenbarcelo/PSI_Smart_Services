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
    const selectAll = document.getElementById('selectAll')
    const certificates = document.getElementById('divCertificates')
    const credentials = document.getElementById('divCredentials')
    const error1 = document.getElementById('error1')
    const error2 = document.getElementById('error2')
    const thSelectAll = document.getElementById('thSelectAll') 

    //deine if corresponds to download certificate
    const certificate = !thSelectAll.classList.contains('notVisible')

    //get last 90 days to filter data
    var dateUntil = new Date().getTime() //today as timestamp
    var dateFrom = dateUntil - (365 * 24 * 60 * 60 * 1000) //remove 90 days in millisecs

    tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    
    //Add events listeners
    viewPassed.addEventListener("click",async(e)=>{
        
        tableTitle.innerText = 'Aprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.add('underlined')
        viewNotPassed.classList.remove('underlined')
        downloadSelected.classList.remove('notVisible')
        credentials.classList.remove('notVisible')
        certificates.classList.remove('notVisible')
        filter = 'passed'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)

    })
    viewNotPassed.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Desprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.add('underlined')
        downloadSelected.classList.add('notVisible')
        credentials.classList.add('notVisible')
        certificates.classList.add('notVisible')
        tableTitle.classList.add('enabled')
        filter = 'notPassed'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)

    })
    viewAllData.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Todos los resultados'
        viewAllData.classList.add('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.remove('underlined')
        downloadSelected.classList.remove('notVisible')
        credentials.classList.remove('notVisible')
        certificates.classList.remove('notVisible')
        filter = 'allData'
        order = 'noOrder'

        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    })
    orderDateAsc.addEventListener("click",async(e)=>{
        order = 'orderDateAsc'
        orderDateAsc.classList.add('notVisible')
        orderDateDesc.classList.remove('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    })
    orderDateDesc.addEventListener("click",async(e)=>{
        order = 'orderDateDesc'
        orderDateAsc.classList.remove('notVisible')
        orderDateDesc.classList.add('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    })
    orderNameAsc.addEventListener("click",async(e)=>{
        order = 'orderNameAsc'
        orderNameAsc.classList.add('notVisible')
        orderNameDesc.classList.remove('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    })
    orderNameDesc.addEventListener("click",async(e)=>{
        order = 'orderNameDesc'
        orderNameAsc.classList.remove('notVisible')
        orderNameDesc.classList.add('notVisible')
        tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
    })
    selectAll.addEventListener("click",async(e)=>{
        const checkboxes = document.querySelectorAll('.checkbox1')
        checkboxes.forEach(checkbox => {
            if (selectAll.checked == true) {
                checkbox.checked = true
            }else{
                checkbox.checked = false
            }
            
          })
    })
    dateFilter.addEventListener("click",async(e)=>{
        divDateFilter.classList.toggle('notVisible')
    })
    downloadSelected.addEventListener("click",async(e)=>{
        
        credentials.classList.remove('isInvalid')
        certificates.classList.remove('isInvalid')
        error1.classList.remove('visible')
        error2.classList.remove('visible')
        error1.classList.add('notVisible')
        error2.classList.add('notVisible')
        thSelectAll.classList.remove('isInvalid')
    })
    acceptBtn.addEventListener("click",async(e)=>{

        var dateFromFiltered = document.getElementById('dateFrom')
        var dateUntilFiltered = document.getElementById('dateUntil')
        
        if (dateFromFiltered.value == '' || dateUntilFiltered.value == 'Invalid Date') {
            divError.innerHTML = '<b>!Debe completar las fechas</b>'
        }else{
            if (dateFromFiltered.value > dateUntilFiltered.value) {
                divError.innerHTML = '<b>!La fecha "Desde" debe ser menor o igual a la fecha "Hasta"</b>'
            }else{

                divError.innerHTML = ''

                const dateFromArray = dateFromFiltered.value.split('-')
                const dateUntilArray = dateUntilFiltered.value.split('-')

                const dateFromString = dateFromArray[2] + '/' + dateFromArray[1] + '/' + dateFromArray[0]
                const dateUntilString = dateUntilArray[2] + '/' + dateUntilArray[1] + '/' + dateUntilArray[0]

                formTitle.innerHTML = 'Resultados del formulario (' + dateFromString + ' - ' + dateUntilString + ')'

                var dateFromAsDate =  new Date(dateFromArray[0],dateFromArray[1]-1,dateFromArray[2])
                var dateUntilAsDate =  new Date(dateUntilArray[0],dateUntilArray[1]-1,dateUntilArray[2])

                dateUntilAsDate.setHours(23, 59, 59, 999)
                
                var dateFrom = new Date(dateFromAsDate).getTime()
                var dateUntil = new Date(dateUntilAsDate).getTime()

                tableRows.innerHTML = await getData(course,company,filter,order,dateFrom,dateUntil,certificate)
            }
        }
    })
})