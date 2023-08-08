const express = require('express')
const path = require('path')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()
const coursesFormsValidations = require('../validations/coursesFormsValidations.js')
const multer = require('multer')
const multerConfig = require('./multerConfig/multerConfig.js')

const uploadStugentPhoto = multer({storage: multerConfig[0]})
const uploadCertTemplate = multer({storage: multerConfig[1]})

router.get('/my-courses',coursesController.myCourses)
router.get('/students-results/:company/:idCourse',coursesController.studentsResults)
router.post('/students-results/:company/:idCourse',coursesFormsValidations.printDocuments,coursesController.printSelected)
//router.get('/print-credentials/:company/:course',coursesController.printCredentials)
router.get('/view-courses',coursesController.viewCourses)
router.get('/create-course',coursesController.createCourse)
router.post('/create-course',coursesFormsValidations.createCourse,coursesController.processCreateCourse)
router.get('/start-course',coursesController.startCourse)
router.get('/start-course/:idCourse',coursesController.entryData)
router.post('/start-course/:idCourse',uploadStugentPhoto.single('image'),coursesFormsValidations.entryData,coursesController.openForm)
router.get('/view-students',coursesController.viewStudents)
router.get('/:typeOfDocument/:idFormData',coursesController.viewDocument)
router.get('/create-certificate',coursesController.createCertificate)
router.post('/create-certificate',uploadCertTemplate.fields([{ name: 'certLogo1', maxCount: 1 }, { name: 'certLogo2', maxCount: 1 },{ name: 'signature1', maxCount: 1 },{ name: 'signature2', maxCount: 1 },{ name: 'certLogo3', maxCount: 1 }]),coursesFormsValidations.createCertificate,coursesController.createCertificateProcess)

module.exports = router

