import { dominio } from "./dominio.js"

export async function getData(course,company,filter,order) {

    let tableDate = ''
    let tableDni = ''
    let tableName = ''
    let tableEmail = ''
    let tableGrade = ''
    let tableSelect = ''
    let tableRows = ''
    
    var data = []
    
    if (filter == 'passed') {
        data = await (await fetch(dominio + 'apis/students-results-passed/' + company + '/' + course)).json()
    }
    if (filter == 'notPassed') {
        data = await (await fetch(dominio + 'apis/students-results-not-passed/' + company + '/' + course)).json()
    }
    if(filter == 'allData'){
        data = await (await fetch(dominio + 'apis/students-results/' + company + '/' + course)).json()
    }

    if (order == 'orderDateDesc') {
        data = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    if (order == 'orderDateAsc') {
        data = data.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    if (order == 'orderNameAsc') {
        data.sort((a, b) => a.last_name.localeCompare(b.last_name))
    }

    if (order == 'orderNameDesc') {
        data.sort((a, b) => b.last_name.localeCompare(a.last_name))
    }

    //define de table lines
    for (let i = 0; i < data.length; i++) {

        let gradeClass = ''
        let checkIcon = ''

        if (data[i].grade > 0.78) {
            gradeClass = 'span1'
            checkIcon = '<td class="td3"><input type="checkbox" name="' + data[i].id + '" class="checkbox1"></td>'
        }else{
            gradeClass = 'span2'
        }

        tableDate = '<td class="td1">' + data[i].dateString + '</td>'
        tableDni = '<td class="td1">' + data[i].dni + '</td>'
        tableName = '</td><td class="td1">' + data[i].last_name + ', ' + data[i].first_name + '</td>'
        tableEmail = '<td class="td1 td4">' + data[i].email + '</td>'
        tableGrade = '<td class="td1 ' + gradeClass + '">' + data[i].grade * 100 + '%</td>'
        tableSelect = checkIcon
        
        tableRows += '<tr>' + tableDate + tableDni + tableName + tableEmail + tableGrade + tableSelect + '</tr>'
    }
        
    return tableRows
}
