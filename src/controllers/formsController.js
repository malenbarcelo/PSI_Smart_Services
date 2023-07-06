const db = require('../../database/models')
const sequelize = require('sequelize')
const googleSheet = require('../forms/spreadsheet')
const puppeteer = require('puppeteer')
const ejs = require('ejs')
const path = require('path')


const formsController = {
    openForm: async(req,res) =>{
        try{

            //const course = 'Seguridad en el Manejo (4x4)'

            //const googleDrive = await googleSheet.accessGoogleDrive()

            //const googleSheetsData = await googleSheet.accessGoogleSheet()

            
            /*
            const formResults = []

            for (let i = 0; i < googleSheetsData.length; i++) {

                //get student eMail
                const studentEmail = googleSheetsData[i]['Dirección de correo electrónico']

                //find student data
                const student = await databaseData.findStudent(studentEmail)

                //get form result
                const earnedPoints = googleSheetsData[i]['Puntuación'].split(' / ')[0]
                const totalPoints = googleSheetsData[i]['Puntuación'].split(' / ')[1]
                const result = parseFloat(earnedPoints)/parseFloat(totalPoints) *100

                //add data to formResults
                formResults.push({
                    firstName: student.first_name,
                    lastName: student.last_name,
                    dni: student.dni,
                    email : studentEmail,
                    idCompany: student.id_companies,
                    result : result})                
            }

            //return res.send(formResults)*/

            return res.render('courses/formResults',{title:'Resultados'})

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    printCertificate: async(req,res) =>{
        try{

          const pdf = await certificates.printCertificate("http://localhost:3000/forms/open-form")
          res.contentType('application/pdf')
          res.setHeader('Content-Type', 'application/pdf')
          res.send(pdf)

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    }
}
module.exports = formsController