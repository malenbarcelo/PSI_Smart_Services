const {body} = require('express-validator')
const db = require('../../database/models')

const coursesFormsValidations = {
    createCourse: [
        body('courseName')
            .notEmpty().withMessage('Ingrese el nombre del curso').bail(),
        body('url')
        .notEmpty().withMessage('Ingrese el enlace del formulario').bail()
    ],
}

module.exports = coursesFormsValidations