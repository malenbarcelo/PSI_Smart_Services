import { dominio } from "../dominio.js"
import srg from "./globals.js"
import {printTableSR} from "./printTable.js"
import {applyFilters} from "./functions.js"
import {clearInputs,closePopupsEventListeners} from "../generalFunctions.js"

window.addEventListener('load',async()=>{

    studentsResultsLoader.style.display = 'block'

    srg.courseName = course.innerText
    srg.courseId = courseId.innerText
    srg.companyName = companyName.innerText

    //get data
    srg.courseData = await (await fetch(dominio + 'apis/course-data/' + srg.courseId)).json()

    //hide certificates if applies
    if (srg.courseData.includes_certificate == 0) {
        studentsResultsDownloads.style.display = 'none'
        srMainFilters.classList.add('mbxl')
        srMainFilters.classList.remove('mbs')
        thCamera.classList.add('notVisible')
        thCheck.classList.add('notVisible')       
    }else{
        studentsResultsDownloads.style.display = 'flex'
        srMainFilters.classList.add('mbs')
        srMainFilters.classList.remove('mbxl')
        thCamera.classList.remove('notVisible')
        thCheck.classList.remove('notVisible')
    }

    srg.studentsResults = await (await fetch(dominio + 'apis/students-results/' + srg.companyName + '/' + srg.courseName)).json()
    srg.studentsResultsFiltered = srg.studentsResults

    printTableSR(srg.studentsResultsFiltered)

    //filters
    const filterCompany = document.getElementById('filterCompany')
    const filters = [filterCompany,filterResult,filterFrom,filterUntil]
    filters.forEach(filter => {
        if(filter){
            filter.addEventListener("change", async() => {
                applyFilters()
                printTableSR(srg.studentsResultsFiltered)
            })
        }
    })

    //unFilter
    unfilter.addEventListener("click", async() => {
        clearInputs([filterCompany,filterResult,filterFrom,filterUntil])
        srg.studentsResultsFiltered = srg.studentsResults        
        printTableSR(srg.studentsResultsFiltered)
    })

    //close popups
    const closePopups = [arppClose,arppCancel]
    closePopupsEventListeners(closePopups)

    





})