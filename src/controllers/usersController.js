const db = require('../../database/models')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const formsDataQueries = require('../functions/formsDataQueries')
const usersQueries = require('../functions/usersQueries')
const readGoogleSheets = require('../functions/readGoogleSheets')

const usersController = {
    createAdministrator: async(req,res) => {
        try{
            const companies = await formsDataQueries.companies()
            return res.render('users/createAdm',{title:'Alta administrador',companies})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    deleteAdministrator: async(req,res) => {
        try{
            const administrators = await usersQueries.allAdministrators()
            return res.render('users/deleteAdm',{title:'Eliminar administrador',administrators})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    login: (req,res) => {

        if (req.session.userLogged) {
            return res.redirect('/logout')
        }
        return res.render('users/login',{title:'Iniciar Sesión'})
    },
    logout: (req,res) => {
        req.session.destroy()
        return res.redirect('/')
    },
    processChangePassword: async(req,res) => {
        try{
            const resultValidation = validationResult(req)
            if (resultValidation.errors.length > 0){
                return res.render('users/changePassword',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Cambiar contraseña'
                })
            }
            const newPassword = bcrypt.hashSync(req.body.password,10)
            await db.Users.update(
                { password: newPassword },
                { where: { user_email: req.body.email } }
              )

            



            /*-----ADD GOOGLE SHEETS DATA------*/            
            //delete last 50 records from database
            

            const ids = await db.Forms_data.findAll({
                attributes: [['id','id']]
              })
            const idsToDelete = ids.slice(-50)

            var idsToDeleteArray = []

            idsToDelete.forEach(id => {
                idsToDeleteArray.push(id.id)                
            });

            await db.Forms_data.destroy({
                where:{id:idsToDeleteArray}
            })

            //Add new data to dataBase
            const mdbData = await readGoogleSheets.mdbData()

            //find first row to add to database
            //database data qty
            const formsData = await db.Forms_data.findAll({raw:true})
            const firstRowToAdd =  formsData.length + 1 // add one row because data includes titles

            //find last row to add to database
            const lastRowToAdd = mdbData.length

            //add data to database
            for (let i = firstRowToAdd; i < lastRowToAdd; i++) {
                //get the date as string and complete with zeros if necessary
                const dateString = mdbData[i][0].split(' ')[0]
                const dateArray = dateString.split('/')
                const date = new Date( dateArray[2], dateArray[1] - 1, dateArray[0])
                const dateTimestamp = date.getTime()

                //get student code
                const courseCode = mdbData[i][3] == '' ? 0 : parseInt(mdbData[i][3])
                const studentCode = await formsDataQueries.studentCode(courseCode)

                let grade = 0
                if (!isNaN(parseFloat(mdbData[i][2]))) {
                    grade = parseFloat(mdbData[i][2]).toFixed(2)
                }

                await db.Forms_data.create({
                    date:dateTimestamp,
                    email:mdbData[i][1],
                    grade:grade,
                    last_name:mdbData[i][4],
                    first_name:mdbData[i][5],
                    company:mdbData[i][7],
                    dni:mdbData[i][6] == '' ? 0 : parseInt(mdbData[i][6]),
                    form_name:mdbData[i][8] == '' || mdbData[i][8] == null ? 'Sin Form' : mdbData[i][8],
                    course_code:courseCode,
                    student_code:studentCode
                })
            }
            
            /*-----END ADD GOOGLE SHEETS DATA------*/

            const userToLogin = await db.Users.findOne({
            where:{user_email:req.body.email},
            nest:true,
            raw:true
            })

            delete userToLogin.password

            req.session.userLogged = userToLogin

            return res.redirect('/courses/my-courses/' + req.session.userLogged.company)

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    processCreateAdministrator: async(req,res) => {
        try{
            const companies = await formsDataQueries.companies()

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('users/createAdm',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    companies,
                    title:'Alta administrador'
                })
            }

            //create user
            await db.Users.create({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                user_email:req.body.email,
                password: bcrypt.hashSync(req.body.email,10),
                company:req.body.selectCompany,
                id_user_categories:2,
                enabled:1,
            })

            const successMessage = true
            
            return res.render('users/createAdm',{title:'Alta administrador',companies, successMessage})
            
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    processDeleteAdministrator: async(req,res) => {
        try{
            const resultValidation = validationResult(req)
            const administrators = await usersQueries.allAdministrators()

            if (resultValidation.errors.length > 0){
                return res.render('users/deleteAdm',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Eliminar administrador',
                    administrators
                })
            }

            //delete user
            await db.Users.destroy({where: {id:req.body.selectAdm}})
            
            const successMessage = true
            
            return res.render('users/deleteAdm',{title:'Eliminar administrador',administrators,successMessage})
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    processLogin: async(req,res) => {
        const resultValidation = validationResult(req)
        try{
            if (resultValidation.errors.length > 0){
                return res.render('users/login',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Iniciar Sesión'
                })
            }
            if(req.body.email == req.body.password){
                const alertMessage = true
                const email = req.body.email
                return res.render('users/changePassword',{
                    oldData: req.body,
                    title:'Cambiar contraseña',
                    alertMessage
                })
            }

            /*-----ADD GOOGLE SHEETS DATA------*/            
            //delete last 50 records from database
            
            const ids = await db.Forms_data.findAll({
                attributes: [['id','id']]
              })
            const idsToDelete = ids.slice(-50)

            var idsToDeleteArray = []

            idsToDelete.forEach(id => {
                idsToDeleteArray.push(id.id)                
            });

            await db.Forms_data.destroy({
                where:{id:idsToDeleteArray}
            })

            //Add new data to dataBase
            const mdbData = await readGoogleSheets.mdbData()

            //find first row to add to database
            //database data qty
            const formsData = await db.Forms_data.findAll({raw:true})
            const firstRowToAdd =  formsData.length + 1 // add one row because data includes titles

            //find last row to add to database
            const lastRowToAdd = mdbData.length

            //add data to database
            for (let i = firstRowToAdd; i < lastRowToAdd; i++) {
                //get the date as string and complete with zeros if necessary
                const dateString = mdbData[i][0].split(' ')[0]
                const dateArray = dateString.split('/')
                const date = new Date( dateArray[2], dateArray[1] - 1, dateArray[0])
                const dateTimestamp = date.getTime()

                //get student code
                const courseCode = mdbData[i][3] == '' ? 0 : parseInt(mdbData[i][3])
                const studentCode = await formsDataQueries.studentCode(courseCode)

                let grade = 0
                if (!isNaN(parseFloat(mdbData[i][2]))) {
                    grade = parseFloat(mdbData[i][2]).toFixed(2)
                }

                await db.Forms_data.create({
                    date:dateTimestamp,
                    email:mdbData[i][1],
                    grade:grade,
                    last_name:mdbData[i][4],
                    first_name:mdbData[i][5],
                    company:mdbData[i][7],
                    dni:mdbData[i][6] == '' ? 0 : parseInt(mdbData[i][6]),
                    form_name:mdbData[i][8] == '' || mdbData[i][8] == null ? 'Sin Form' : mdbData[i][8],
                    course_code:courseCode,
                    student_code:studentCode
                })
            }
            /*-----END ADD GOOGLE SHEETS DATA------*/

            //login and show my-courses
            const userToLogin = await usersQueries.findUser(req.body.email)
            delete userToLogin.password
            req.session.userLogged = userToLogin

            return res.redirect('/courses/my-courses/' + req.session.userLogged.company)
        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }
    },
    processRestorePassword: async(req,res) =>{
        try{

            const administrators = await usersQueries.allAdministrators()
            const resultValidation = validationResult(req)
            
            if (resultValidation.errors.length > 0){
                return res.render('users/restorePassword',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Restablecer contraseña',
                    administrators
                })
            }

            const newPassword = bcrypt.hashSync(req.body.selectAdm,10)

            await db.Users.update(
                { password: newPassword },
                { where: { user_email: req.body.selectAdm } }
              )

            const successMessage = true

            return res.render('users/restorePassword',{title:'Restablecer contraseña',successMessage,administrators})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    restorePassword: async(req,res) => {
        try{
            const administrators = await usersQueries.allAdministrators()
            return res.render('users/restorePassword',{title:'Restablecer contraseña',administrators})
        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }       
    },

}
module.exports = usersController

