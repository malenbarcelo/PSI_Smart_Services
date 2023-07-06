const express = require('express')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()
const coursesFormsValidations = require('../validations/coursesFormsValidations.js')

router.get('/my-courses',coursesController.myCourses)
router.get('/students-results/:company/:courseName',coursesController.studentsResults)
router.get('/credential/:idFormData',coursesController.viewCredential)
router.get('/print-credential/:idFormData',coursesController.printCredential)
router.get('/print-credentials/:company/:course',coursesController.printCredentials)
router.get('/view-courses',coursesController.viewCourses)
router.get('/create-course',coursesController.createCourse)
router.post('/create-course',coursesFormsValidations.createCourse,coursesController.processCreateCourse)
router.get('/start-course',coursesController.startCourse)
router.get('/start-course/:courseName',coursesController.entryData)

module.exports = router

