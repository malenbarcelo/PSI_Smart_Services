const express = require('express')
const apisController = require('../controllers/apisController.js')
const userMiddleware = require('../middlewares/userMiddleware.js')

const router = express.Router()

router.get('/students-results/:company/:courseName',userMiddleware,apisController.studentsResults)
router.get('/students-results-passed/:company/:courseName',userMiddleware,apisController.studentsResultsPassed)
router.get('/students-results-not-passed/:company/:courseName',userMiddleware,apisController.studentsResultsNotPassed)
router.get('/student-data/:company/:dni',userMiddleware,apisController.studentData)

module.exports = router
