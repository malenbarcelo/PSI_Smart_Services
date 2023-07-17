const express = require('express')
const apisController = require('../controllers/apisController.js')

const router = express.Router()

router.get('/drive-files',apisController.driveFiles)
router.get('/students-results/:company/:courseName',apisController.studentsResults)
router.get('/students-results-passed/:company/:courseName',apisController.studentsResultsPassed)
router.get('/students-results-not-passed/:company/:courseName',apisController.studentsResultsNotPassed)
router.get('/student-data/:company/:dni',apisController.studentData)

module.exports = router
