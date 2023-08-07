const db = require('../../database/models')
const sequelize = require('sequelize')

const formsDataQueries = {
    allCourses: async() => {
        try{
            const courses = await db.Courses.findAll({
                order:['course_name'],
                raw:true,
            })
            return courses
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    courseId: async(courseName) => {
        try{
            const courseId = await db.Courses.findOne({
                where:{course_name:courseName},
                attributes:['id'],
                raw:true,
            })
            return courseId.id
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    courseName: async(idCourse) => {
        try{
            const courseName = await db.Courses.findOne({
                where:{id:idCourse},
                attributes:['course_name'],
                raw:true,
            })
            return courseName.course_name
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    courses: async() => {
        try{
            const courses = await db.Courses.findAll({
                order:['course_name'],
                attributes:[['course_name','form_name']],
                raw:true,
            })
            return courses
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    certificateTemplate: async(courseId) => {
        try{
            const template = await db.Certificates_templates.findOne({
                where:{id_courses:courseId}
            })
            return template
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    credentialTemplate: async(courseId) => {
        try{
            const template = await db.Credentials_templates.findOne({
                where:{id_courses:courseId}
            })
            return template
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    courseUrl: async(idCourse) => {
        try{
            const courseUrl = await db.Courses.findOne({
                where:{id:idCourse},
                attributes:['url'],
                raw:true,
            })
            return courseUrl
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    filtrateCourse: async(courseName) => {
        try{
            const courseUrl = await db.Courses.findOne({
                where:{course_name:courseName},
                raw:true,
            })
            return courseUrl
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = formsDataQueries