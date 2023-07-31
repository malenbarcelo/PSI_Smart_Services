const db = require('../../database/models')
const formsDataQueries = require('./formsDataQueries')
const coursesQueries = require('./coursesQueries')
const datesFunctions = require('./datesFunctions')
const profileImagesQueries = require('./profileImagesQueries')

const credentialData = {
    allCredentialData: async(idFormData) => {
        try{
            //get credential data
            const credentialData = await formsDataQueries.studentDataFiltered(idFormData)

            //get course name
            const courseName = credentialData.form_name

            //get course
            const courseData = await coursesQueries.filtrateCourse(courseName) 

            //get course id
            const courseId = courseData.id

            //get credential template
            const credentialTemplate = await db.Credentials_templates.findOne({
                where:{id_courses:courseId},
                raw:true
            })

            //get validity
            const validity =  courseData.validity

            //get expiration date
            const issueDate = credentialData.date
            const issueDateString = await datesFunctions.dateToString(issueDate)
            const expirationDateTimestamp =  issueDate.setMonth(issueDate.getMonth() + validity)
            const expirationDate = new Date(expirationDateTimestamp)
            const expirationDateString = await datesFunctions.dateToString(expirationDate)

            //get student image
            const studentImage = await profileImagesQueries.imageName(credentialData.dni,courseName)
            
            //get credential code
            const courseCode = credentialData.course_code
            const date = issueDateString.split('/')[0] + issueDateString.split('/')[1] + issueDateString.split('/')[2]
            const studentCode = credentialData.student_code
            const credentialCode = courseCode + '-' + date + '-' + studentCode

            const allCredentialData = {credentialCode,credentialTemplate,credentialData,issueDateString,expirationDateString,studentImage}
            
            return allCredentialData

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    }
}

module.exports = credentialData