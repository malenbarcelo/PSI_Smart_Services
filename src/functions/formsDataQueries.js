const db = require('../../database/models')
const sequelize = require('sequelize')

const formsDataQueries = {
    companies: async() => {
        try{
            const companies = await db.Forms_data.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('company')), 'company']],
                order:['company'],
                raw:true,
            })
            return companies
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    companiesFiltered: async(course) => {
        try{
            const companies = await db.Forms_data.findAll({
                where:{form_name:course},
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('company')), 'company']],
                order:['company'],
                raw:true,
            })
            return companies
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    allCourses: async() => {
        try{
            const courses = await db.Forms_data.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('form_name')), 'form_name']],
                order:['form_name'],
                raw:true,
            })
            return courses
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    coursesFiltered: async(company) => {
        try{
            const courses = await db.Forms_data.findAll({
                where: {company:company},
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('form_name')), 'form_name']],
                order:['form_name'],
                raw:true,
            })
            return courses
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    studentDataFiltered: async(idFormData) => {

        const studentDataFiltered = await db.Forms_data.findOne({
            where:{id:idFormData},
            raw:true
        })
        return studentDataFiltered        
    },
    studentLastResult: async(course,dni) => {
        try{
            //get id of last exam
            const idLastResult = await db.Forms_data.findOne({
                where: {form_name:course,dni:dni},
                attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']],
                raw:true,
            })
            //get last exam data
            const studentLastResult = await db.Forms_data.findOne({
                where: {id:idLastResult.id},
                raw:true,
            })
            
            return studentLastResult

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    studentLastResultFiltered: async(company,course,dni) => {
        try{
            //get id of last exam
            const idLastResult = await db.Forms_data.findOne({
                where: {company:company,form_name:course,dni:dni},
                attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']],
                raw:true,
            })
            //get last exam data
            const studentLastResult = await db.Forms_data.findOne({
                where: {id:idLastResult.id},
                raw:true,
            })
            
            return studentLastResult

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    studentsDataFiltered: async(company,course) => {

        //get the max id of each student
        const idsList = await db.Forms_data.findAll({
            where:{company:company,form_name:course},
            attributes: ['dni', [sequelize.fn('MAX', sequelize.col('id')), 'id']],
            group: ['dni']
        })

        const idsArray = idsList.map(obj => obj.id)

        //get studentsData
        const studentsData = await db.Forms_data.findAll({
            where:{id:idsArray},
            order:[['last_name','ASC']]
        })

        return studentsData        
    },
    studentsQty: async(course) => {
        try{
            const studentsQty = await db.Forms_data.findAll({
                where: {form_name:course},
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('dni')), 'dni']],
                raw:true,
            })
            return studentsQty
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },    
    studentsQtyFiltered: async(company,course) => {
        try{
            const studentsQty = await db.Forms_data.findAll({
                where: {company:company,form_name:course},
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('dni')), 'dni']],
                raw:true,
            })
            return studentsQty
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = formsDataQueries