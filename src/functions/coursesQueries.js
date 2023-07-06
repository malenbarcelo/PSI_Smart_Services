const db = require('../../database/models')
const sequelize = require('sequelize')

const formsDataQueries = {
    courses: async() => {
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
}

module.exports = formsDataQueries