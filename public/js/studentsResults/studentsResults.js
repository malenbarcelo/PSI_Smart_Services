import { dominio } from "../dominio.js"
import srg from "./globals.js"
import {printTableSR} from "./printTable.js"
import {applyFilters} from "./functions.js"
import {clearInputs,closePopupsEventListeners,showTableInfo} from "../generalFunctions.js"

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
        checkIcon.classList.add('notVisible')       
    }else{
        studentsResultsDownloads.style.display = 'flex'
        srMainFilters.classList.add('mbs')
        srMainFilters.classList.remove('mbxl')
        thCamera.classList.remove('notVisible')
        checkIcon.classList.remove('notVisible')
    }

    srg.studentsResults = await (await fetch(dominio + 'apis/students-results/' + srg.companyName + '/' + srg.courseName)).json()
    srg.studentsResultsFiltered = srg.studentsResults

    printTableSR(srg.studentsResultsFiltered)

    //filters
    const filterCompany = document.getElementById('filterCompany')
    const filters = [filterCompany,filterResult,filterDni,filterFrom,filterUntil]
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
        clearInputs([filterCompany,filterResult,filterDni,filterFrom,filterUntil])
        srg.studentsResultsFiltered = srg.studentsResults        
        printTableSR(srg.studentsResultsFiltered)
    })

    //close popups
    const closePopups = [arppClose,arppCancel]
    closePopupsEventListeners(closePopups)

    //table info events listeners
    const tableIcons = [
        {
            icon:infoIcon,
            right:'13.5%'
        },
        {
            icon:obsIcon,
            right:'9.5%'
        },
        {
            icon:imageIcon,
            right:'6%'
        },
        {
            icon:checkIcon,
            right:'2%'
        }
    ]

    showTableInfo(tableIcons,225,150)

    //select all elements
    thCheck.addEventListener("click", async() => {
        if (thCheck.checked) {
            srg.downloadSelected = srg.downloadAlloweded
            srg.downloadAlloweded.forEach(element => {
                const check = document.getElementById('check_' + element)
                check.checked = true
            })
        }else{
            srg.downloadSelected = []
            srg.downloadAlloweded.forEach(element => {
                const check = document.getElementById('check_' + element)
                check.checked = false
            })
        }
    })

    //download
    srDownload.addEventListener("click", async() => {

        let errors = 0
        
        if (srg.downloadSelected.length == 0 || (printCertificates.checked == false && printCredentials.checked == false)) {
            errors +=1
            srError.classList.remove('notVisible')
        }else{
            srError.classList.add('notVisible')
        }
    })

    

    





})