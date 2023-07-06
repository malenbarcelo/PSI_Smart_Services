import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    const company = document.getElementById('userLoggedCompany').innerText
    const course = document.getElementById('course').innerText

    const studentsResults = await (await fetch(dominio + 'apis/students-results/' + company + '/' + course)).json()
    const studentsResultsPassed = await (await fetch(dominio + 'apis/students-results-passed/' + company + '/' + course)).json()
    const studentsResultsNotPassed = await (await fetch(dominio + 'apis/students-results-not-passed/' + company + '/' + course)).json()
    
    const viewAllData = document.getElementById('viewAllData')
    const viewPassed = document.getElementById('viewPassed')
    const viewNotPassed = document.getElementById('viewNotPassed')
    const tableTitle = document.getElementById('tableTitle')
    const tableStudentsResults = document.getElementById('tableStudentsResults')

    const tableInnerHTMLFirstLine = '<table class="table1"><tr><th class="tableTitle1">DNI</th><th class="tableTitle1">Apellido y nombre</th><th class="tableTitle1">Email</th><th class="tableTitle1">Nota</th></tr>'
    const tableInnerHTMLLastLine = '<table>'
    
    viewPassed.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Aprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.add('underlined')
        viewNotPassed.classList.remove('underlined')

        let tableInnerHTML = ''

        for( let i = 0; i < studentsResultsPassed.length; i++ ) {
            tableInnerHTML += '<tr><td class="td1">' + studentsResultsPassed[i].dni + '</td><td class="td1">' + studentsResultsPassed[i].last_name + ', ' + studentsResultsPassed[i].first_name + '</td><td class="td1">' + studentsResultsPassed[i].email + '</td><td class="td1 span1">' + studentsResultsPassed[i].grade * 100 + '%' + '</td><td class="td3"> <i class="fa-solid fa-plus"></i></td><td class="td3"><a href="/courses/print-credential/' + studentsResultsPassed[i].id +'"><i class="fa-solid fa-download"></i></a></td></tr>'
        }

        tableStudentsResults.innerHTML = tableInnerHTMLFirstLine + tableInnerHTML + tableInnerHTMLLastLine
        
    })
    viewNotPassed.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Desprobados'
        viewAllData.classList.remove('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.add('underlined')

        let tableInnerHTML = ''

        for( let i = 0; i < studentsResultsNotPassed.length; i++ ) {
            tableInnerHTML += '<tr><td class="td1">' + studentsResultsNotPassed[i].dni + '</td><td class="td1">' + studentsResultsNotPassed[i].last_name + ', ' + studentsResultsNotPassed[i].first_name + '</td><td class="td1">' + studentsResultsNotPassed[i].email + '</td><td class="td1 span2">' + studentsResultsNotPassed[i].grade * 100 + '%' + '</td><td class="td3"> <i class="fa-solid fa-plus"></i></td></tr>'
        }

        tableStudentsResults.innerHTML = tableInnerHTMLFirstLine + tableInnerHTML + tableInnerHTMLLastLine
    })
    viewAllData.addEventListener("click",async(e)=>{
        tableTitle.innerText = 'Todos los resultados'
        viewAllData.classList.add('underlined')
        viewPassed.classList.remove('underlined')
        viewNotPassed.classList.remove('underlined')

        let tableInnerHTML = ''

        for( let i = 0; i < studentsResults.length; i++ ) {

            let gradeClass = ''
            let downloadIcon = ''

            if (studentsResults[i].grade > 0.78){
                gradeClass = 'span1'
                downloadIcon = '<td class="td3"><a href="/courses/print-credential/' + studentsResults[i].id +'"><i class="fa-solid fa-download"></i></a></td>'
            }else{
                gradeClass = 'span2'
            }

            tableInnerHTML += '<tr><td class="td1">' + studentsResults[i].dni + '</td><td class="td1">' + studentsResults[i].last_name + ', ' + studentsResults[i].first_name + '</td><td class="td1">' + studentsResults[i].email + '</td><td class="td1 ' + gradeClass + '">' + studentsResults[i].grade * 100 + '%' + '</td><td class="td3"> <i class="fa-solid fa-plus"></i></td>' + downloadIcon + '</tr>'
        }

        tableStudentsResults.innerHTML = tableInnerHTMLFirstLine + tableInnerHTML + tableInnerHTMLLastLine
    })
})