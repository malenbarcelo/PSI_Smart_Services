const {body} = require('express-validator')
const db = require('../../database/models')
const path = require('path')
const fs = require('fs')
const coursesQueries = require('../functions/coursesQueries')

const coursesFormsValidations = {
    createCertificate: [
        body('selectCourse')
            .custom(async(value,{ req }) => {
                if (req.body.selectCourse == 'default') {
                throw new Error('Seleccione un curso')
                }
                return true
            }),
            body('certLogo1').custom((value, { req }) => {
                let file = req.files.certLogo1
                let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
                if(!file){
                    throw new Error('Ingrese el logo principal del certificado')
                }else{
                    let fileExtension = req.files.certLogo1[0].originalname
                    fileExtension = fileExtension.split('.')
                    fileExtension = fileExtension[fileExtension.length - 1]
                    
                    if(!acceptedExtensions.includes(fileExtension)){
                        throw new Error(`Las extensiones aceptadas para el Logo 1 son: ${acceptedExtensions.join(',')}`)
                    }
                }
                return true}),
            body('certLogo2').custom((value, { req }) => {
                let file = req.files.certLogo2
                let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
                if(file){
                    let fileExtension = req.files.certLogo2[0].originalname
                    fileExtension = fileExtension.split('.')
                    fileExtension = fileExtension[fileExtension.length - 1]
                    if(!acceptedExtensions.includes(fileExtension)){
                        throw new Error(`Las extensiones aceptadas para el Logo 2 son: ${acceptedExtensions.join(',')}`)
                    }
                }
                return true}),
        body('selectTypeOfCourse')
            .custom(async(value,{ req }) => {
                if (req.body.selectTypeOfCourse == 'default') {
                throw new Error('Seleccione un tipo de curso')
                }
                return true
            }),
        body('courseName')
            .notEmpty().withMessage('Ingrese el nombre del curso tal como irá en el certificado'),
        body('theoryHours')
            .custom((value, { req }) => {
                if(req.body.theoryHours == undefined && (req.body.selectTypeOfCourse == 'theoretical' || req.body.selectTypeOfCourse == 'theoretical-practical')){
                    throw new Error('Ingrese cantidad de horas de teoría')
                }
                return true}),
        body('practicalHours')
            .custom((value, { req }) => {
                if(req.body.practiceHours == undefined && (req.body.selectTypeOfCourse == 'practical' || req.body.selectTypeOfCourse == 'theoretical-practical')){
                    throw new Error('Ingrese cantidad de horas de práctica')
                }
                return true}),
        body('text1')
            .notEmpty().withMessage('Ingrese el texto 1'),
        body('text2')
            .notEmpty().withMessage('Ingrese el texto 2'),
        body('signature1')
            .custom((value, { req }) => {
                let file = req.files.signature1
                let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
                if(!file){
                    throw new Error('Ingrese la imagen de la firma 1')
                }else{
                    let fileExtension = req.files.signature1[0].originalname
                    fileExtension = fileExtension.split('.')
                    fileExtension = fileExtension[fileExtension.length - 1]
                    
                    if(!acceptedExtensions.includes(fileExtension)){
                        throw new Error(`Las extensiones aceptadas para la firma 1 son: ${acceptedExtensions.join(',')}`)
                    }
                }
                return true}),
        body('signature1Line1')
            .notEmpty().withMessage('Ingrese la aclaración de la firma 1'),
        body('signature1Line2')
            .notEmpty().withMessage('Ingrese la descripción de la firma 1'),
        body('signature2').custom((value, { req }) => {
            let file = req.files.signature2
            let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
            if(!file){
                throw new Error('Ingrese la imagen de la firma 2')
            }else{
                let fileExtension = req.files.signature2[0].originalname
                fileExtension = fileExtension.split('.')
                fileExtension = fileExtension[fileExtension.length - 1]
                
                if(!acceptedExtensions.includes(fileExtension)){
                    throw new Error(`Las extensiones aceptadas para la firma 2 son: ${acceptedExtensions.join(',')}`)
                }
            }
            return true}),
        body('signature2Line1')
            .notEmpty().withMessage('Ingrese la aclaración de la firma 2'),
        body('signature2Line2')
            .notEmpty().withMessage('Ingrese la descripción de la firma 2'),
        body('certLogo3').custom((value, { req }) => {
            let file = req.files.certLogo3
            let acceptedExtensions = ['.jpg','.jpeg','.png','.gif']               
            if(file){
                let fileExtension = req.files.certLogo3[0].originalname
                fileExtension = fileExtension.split('.')
                fileExtension = fileExtension[fileExtension.length - 1]
                if(!acceptedExtensions.includes(fileExtension)){
                    throw new Error(`Las extensiones aceptadas para el logo del pie de página son: ${acceptedExtensions.join(',')}`)
                }
            }
            return true}),
    ],
    createCourse: [
        body('courseName')
            .notEmpty().withMessage('Ingrese el nombre del curso')
            .custom(async(value,{ req }) => {
                const course = await db.Courses.findOne({
                    where:{course_name:req.body.courseName},
                    attributes:['id'],
                    raw:true,
                })
                if (course) {
                throw new Error('Ya existe en la base un curso con ese nombre')
                }
                return true
            }),
        body('url')
            .notEmpty().withMessage('Ingrese el enlace del formulario'),
        body('validity')
            .notEmpty().withMessage('Ingrese la validez del formulario')
            .isNumeric().withMessage('La validez debe ser un número entero (cantidad de meses)')
        
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
    printDocuments: [
        body('credentials')
            .custom(async(value,{ req }) => {
                const body = Object.keys(req.body)
                if (!body.includes('credentials') && !body.includes('certificates')) {
                    throw new Error('Debe seleccionar al menos un tipo de documento')
                }
                return true
            }),
        body('selectAll')
            .custom(async(value,{ req }) => {
                const body = Object.keys(req.body)
                let selectedKeys = 0
                for (let i = 0; i < body.length; i++) {
                    if (body[i] != 'credentials' && body[i] != 'certificates') {
                        selectedKeys += 1
                    }
                }
                if (selectedKeys == 0) {
                    throw new Error('Debe seleccionar al menos un alumno')
                }
                return true
            }),
        body('certificateTemplate')
            .custom(async(value,{ req }) => {
                const courseId = req.params.idCourse
                const certificateTemplate = await coursesQueries.certificateTemplate(courseId)
                const body = Object.keys(req.body)
                if (body.includes('certificates') && !certificateTemplate) {
                    throw new Error('El curso "' + courseName + '" no posee un modelo de certificado para imprimir')
                }
                return true
            }),
        body('credentialTemplate')
            .custom(async(value,{ req }) => {
                const courseId = req.params.idCourse
                const credentialTemplate = await coursesQueries.credentialTemplate(courseId)
                const body = Object.keys(req.body)
                if (body.includes('credentials') && !credentialTemplate) {
                    throw new Error('El curso "' + courseName + '" no posee un modelo de credencial para imprimir')
                }
                return true
            }),
    ],
}

module.exports = coursesFormsValidations