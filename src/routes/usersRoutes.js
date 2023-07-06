const express = require('express')
const usersController = require('../controllers/usersController.js')
const router = express.Router()
const userFormsValidations = require('../validations/userFormsValidations.js')
const authMiddleware = require('../middlewares/authMiddleware.js')
const admMiddleware = require('../middlewares/admMiddleware.js')
const multer = require('multer')
const path = require('path')

//Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/assignStudentsFiles'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()    
      const fileExtension = path.extname(file.originalname)   
      const fileName = file.originalname.replace(fileExtension,'')      
      cb(null, 'fileAssignStudents' + uniqueSuffix + fileExtension)
    }
  })

const upload = multer({storage: storage})  

router.get('/',usersController.login)
router.post('/login',userFormsValidations.loginFormValidations,usersController.processLogin)
router.get('/logout',usersController.logout)
router.get('/create-administrator',usersController.createAdministrator)
router.post('/create-administrator',userFormsValidations.createAdmFormValidations,usersController.processCreateAdministrator)
router.post('/change-password',userFormsValidations.changePswFormValidations,usersController.processChangePassword)
router.get('/delete-administrator',usersController.deleteAdministrator)
router.post('/delete-administrator',userFormsValidations.deleteAdministratorFormValidations,usersController.processDeleteAdministrator)
router.get('/restore-password',usersController.restorePassword)
router.post('/restore-password',userFormsValidations.restorePswFormValidations,usersController.processRestorePassword)


module.exports = router

