const {body} = require('express-validator')
const db = require('../../database/models')
const path = require('path')
const fs = require('fs')

const coursesFormsValidations = {
    createCourse: [
        body('courseName')
            .notEmpty().withMessage('Ingrese el nombre del curso'),
        body('url')
            .notEmpty().withMessage('Ingrese el enlace del formulario'),
        body('validity')
            .notEmpty().withMessage('Ingrese la vigencia del certificado en meses')
            .isNumeric().withMessage('La vigencia debe ser numérica (meses de validez)')
    ],
    entryData: [
        body('dni')
            .notEmpty().withMessage('Ingrese su DNI')
            .isNumeric().withMessage('El DNI debe ser numérico, sin comas ni puntos'),
        body('image').custom((value, { req }) => {
            let file = req.file
            let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
            if(!file){
                throw new Error('Ingrese su foto de perfil')
            }else{
                let fileExtension = path.extname(file.originalname)
                if(!acceptedExtensions.includes(fileExtension)){

                    fs.unlink(file.path, (err) => {
                        if (err) {
                          console.error('Error al eliminar el archivo:', err);
                        }
                      });

                    throw new Error(`Las extensiones aceptadas son ${acceptedExtensions.join(',')}`)
                }
            }
            return true}),
    ],
}

module.exports = coursesFormsValidations