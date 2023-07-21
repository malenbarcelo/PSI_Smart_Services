const express = require('express')
const path = require('path')
const coursesController = require('../controllers/coursesController.js')
const router = express.Router()
const coursesFormsValidations = require('../validations/coursesFormsValidations.js')
const multer = require('multer')

//Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/images/studentsPhotos'))
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname)   
      const fileName = req.body.dni + '-' + req.params.courseName      
      cb(null, fileName + fileExtension)
    }
  })

const upload = multer({storage: storage})

router.get('/my-courses',coursesController.myCourses)
router.get('/students-results/:company/:courseName',coursesController.studentsResults)
router.post('/students-results/:company/:courseName',coursesController.printSelectedCredentials)
router.get('/view-credential/:idFormData',coursesController.viewCredential)
router.get('/print-credential/:idFormData',coursesController.printCredential)
router.get('/print-credentials/:company/:course',coursesController.printCredentials)
router.get('/view-courses',coursesController.viewCourses)
router.get('/create-course',coursesController.createCourse)
router.post('/create-course',coursesFormsValidations.createCourse,coursesController.processCreateCourse)
router.get('/start-course',coursesController.startCourse)
router.get('/start-course/:courseName',coursesController.entryData)
router.post('/start-course/:courseName',upload.single('image'),coursesFormsValidations.entryData,coursesController.openForm)
router.get('/view-students',coursesController.viewStudents)
router.get('/view-certificate/:idFormData',coursesController.viewCertificate)

module.exports = router

