import { dominio } from "./dominio.js"

export async function getData(course,company,filter,order,dateFrom,dateUntil,certificate) {

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

    data = data.filter(item => new Date(item.date).getTime() >= dateFrom && new Date(item.date).getTime() <= dateUntil)
    
    //define the table lines
    for (let i = 0; i < data.length; i++) {

        var notPassed = 0
        const passGrade = parseFloat(data[i].pass_grade)/100

        for (let j = 0; j < data[i].associatedForms.length; j++) {
            if (data[i].associatedForms[j].grade < passGrade || data[i].associatedForms[j].grade == 'NA') {
                notPassed += 1
            }
        }

        let gradeClass = ''
        let checkIcon = '<td class="td1 td3"></td>'

        if (data[i].grade > passGrade && notPassed == 0) {
            gradeClass = 'span1'
            checkIcon = '<td class="td1 td3"><input type="checkbox" name="' + data[i].id + '" class="checkbox1"></td>'
        }else{
            if (data[i].grade > passGrade && notPassed > 0) {
                gradeClass = 'span4'
            }else{
                gradeClass = 'span2'
            }
        }
        

        tableDate = '<td class="td1">' + data[i].dateString + '</td>'
        tableDni = '<td class="td1">' + data[i].dni + '</td>'
        tableName = '</td><td class="td1">' + data[i].last_name + ', ' + data[i].first_name + '</td>'
        tableEmail = '<td class="td1 td4">' + data[i].email + '</td>'
        tableGrade = '<td class="td1 ' + gradeClass + '">' + data[i].grade * 100 + '%</td>'
        tableSelect = certificate == true ? checkIcon : ''
        
        tableRows += '<tr>' + tableDate + tableDni + tableName + tableEmail + tableGrade + tableSelect + '</tr>'
    }
        
    return tableRows
}
