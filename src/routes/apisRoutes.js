const express = require('express')
const apisController = require('../controllers/apisController.js')

const router = express.Router()

//router.get('/users',apisController.users)
//router.get('/users/:idUser',apisController.usersFiltered)
//router.get('/students/:studentEmail',apisController.studentFiltered)
//router.get('/question-types',apisController.questionTypes)
//router.get('/courses-results',apisController.coursesResults)
router.get('/drive-files',apisController.driveFiles)
router.get('/students-results/:company/:courseName',apisController.studentsResults)
router.get('/students-results-passed/:company/:courseName',apisController.studentsResultsPassed)
router.get('/students-results-not-passed/:company/:courseName',apisController.studentsResultsNotPassed)

module.exports = router
