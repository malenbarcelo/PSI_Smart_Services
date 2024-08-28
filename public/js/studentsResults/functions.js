import srg from "./globals.js"

function applyFilters() {

    srg.studentsResultsFiltered = srg.studentsResults

    //company
    const filterCompany = document.getElementById('filterCompany')
    if (filterCompany) {
        srg.studentsResultsFiltered = filterCompany.value == '' ? srg.studentsResultsFiltered : srg.studentsResultsFiltered.filter(sr => sr.company == filterCompany.value)
    }

    //result
    srg.studentsResultsFiltered = filterResult.value == '' ? srg.studentsResultsFiltered : srg.studentsResultsFiltered.filter(sr => sr.passed == filterResult.value)
        
}


export {applyFilters}