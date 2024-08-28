import {dateToString} from "../generalFunctions.js"
import srg from "./globals.js"

async function printTableSR(dataToPrint) {

    studentsResultsLoader.style.display = 'block'
    studentsResultsBody.innerHTML = ''
    let counter = 0

    let html = ''

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        let notPassedAssociations = 0
        element.associatedResults.forEach(ar => {
            if (ar == null || ar.passed == 0) {
                notPassedAssociations += 1
            }
        })
        
        const color = element.passed == 0 ? 'redColor' : (notPassedAssociations > 0 ? 'yellowColor' : 'greenColor')
        const camera = element.student_image.length != 0 ? '' : '<i class="fa-solid fa-camera errorIcon" id="image_' + element.id + '"></i>'
        const checkIcon = color == 'greenColor' ? '<input type="checkbox" name="' + element.id + '" class="checkbox1">' : ''

        html += `
            <tr>
                <th class="${rowClass}">${element.company}</th>
                <th class="${rowClass}">${dateToString(element.date)}</th>
                <th class="${rowClass}">${element.dni}</th>
                <th class="${rowClass}">${element.last_name + ', ' + element.first_name}</th>
                <th class="${rowClass}">${element.email}</th>
                <th class="${rowClass + ' ' + color}">${element.grade * 100 + '%'}</th>
                <th class="${rowClass}"><i class="fa-solid fa-circle-info allowedIcon" id="info_${element.id}"></i></th>
                <th class="${rowClass}">${'obs'}</th>
        `
        if (srg.courseData.includes_certificate == 1) {
            html += `
                <th class="${rowClass}">${ camera }</th>
                <th class="${rowClass}">${ checkIcon }</th>
            </tr>
            `
        }else{
            html += `
                </tr>
            `

        }

        counter += 1
    })

    studentsResultsBody.innerHTML += html

    srEventListeners(dataToPrint)

    studentsResultsLoader.style.display = 'none'
    
}

function srEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const info = document.getElementById('info_' + element.id)

        //associated forms info
        info.addEventListener('click',async()=>{
            arppMainTitle.innerHTML = element.last_name + ', ' + element.first_name
            if (element.associatedResults.length == 0) {
                arppNoAssociatedForms.style.display = 'flex'
                arppTable.style.display = 'none'
            }else{
                arppNoAssociatedForms.style.display = 'none'
                arppTable.style.display = 'block'
            }
            arpp.style.display = 'block'
        })
        
    })
}

export {printTableSR}