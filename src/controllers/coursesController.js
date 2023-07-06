const db = require('../../database/models')
const {validationResult} = require('express-validator')
const formsDataQueries = require('../functions/formsDataQueries')
const coursesQueries = require('../functions/coursesQueries')
const sequelize = require('sequelize')
const puppeteer = require('puppeteer')
const archiver = require('archiver')
const fetch = require('cross-fetch')

const coursesController = {
    createCourse: async(req,res) => {
        try{
            return res.render('courses/createCourse',{title:'Crear curso'})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    entryData: async(req,res) => {
        try{
            const course = req.params.courseName
            return res.send(course)
            return res.render('courses/entryData',{title:'Iniciar curso',course})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    myCourses: async(req,res) => {
        try{
            //get courses to show
            let coursesData = []
            let company = ''            

            if (req.session.userLogged.id_user_categories == 1){
                coursesData = await formsDataQueries.allCourses()
            }else{
                company = req.session.userLogged.company
                coursesData = await formsDataQueries.coursesFiltered(company)
            }

            //add students qty to coursesData
            let students = ''

            for (let i = 0; i < coursesData.length; i++) {
                const course = coursesData[i].form_name
                if (req.session.userLogged.id_user_categories == 1){
                    students = await formsDataQueries.studentsQty(course)
                }else{
                    students = await formsDataQueries.studentsQtyFiltered(company,course)
                }

                let passed = 0
                let notPassed = 0
                
                for (let j = 0; j < students.length; j++) {
                    let studentLastResult = ''
                    if (req.session.userLogged.id_user_categories == 1){
                        studentLastResult = await formsDataQueries.studentLastResult(course,students[j].dni)
                    }else{
                        studentLastResult = await formsDataQueries.studentLastResultFiltered(company,course,students[j].dni)
                    }
                    
                    if (studentLastResult.grade > 0.78) {
                        passed += 1
                    }else{
                        notPassed += 1
                    }
                    
                }
                coursesData[i].studentsQty = students.length
                coursesData[i].passed = passed
                coursesData[i].passedPercentage = (passed / students.length * 100).toFixed(2)
                coursesData[i].notPassed = notPassed
                coursesData[i].notPassedPercentage = (notPassed / students.length * 100).toFixed(2)

                //if user logged is administrator, add company qty
                if (req.session.userLogged.id_user_categories == 1){
                    const companiesQty = await formsDataQueries.companiesFiltered(course)
                    coursesData[i].companiesQty = companiesQty.length
                }
            }

            return res.render('courses/myCourses',{title:'Mis cursos',coursesData})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    printCredential: async(req,res) =>{
        try{

            const idFormData = req.params.idFormData

            const studentDataFiltered = await formsDataQueries.studentDataFiltered(idFormData)
            const dni = studentDataFiltered.dni
            const name = studentDataFiltered.last_name + ' ' + studentDataFiltered.first_name
            const fileName = name + ' - ' + dni            

            const url = "http://localhost:3000/courses/credential/" + idFormData

            const browser = await puppeteer.launch({
                headless: "new",
                printBackground: true 
                })
            const page = await browser.newPage()
    
            await page.goto(url, { waitUntil: 'networkidle0' })

            await new Promise((resolve) => setTimeout(resolve, 2000))
            
            //make sure that css colors are taken in the exact way of styles.css
            await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
    
            const pdf = await page.pdf({printBackground: true})
    
            await browser.close()
    
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName + '.pdf');
            res.setHeader('Content-Type', 'application/pdf');
    
            res.send(pdf)

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    printCredentials: async(req,res) =>{
        try{

            const company = req.params.company
            const course = req.params.course
            
            //get course students
            const studentsData = await formsDataQueries.studentsDataFiltered(company,course)
            const studentsDataPassed = studentsData.filter(data => parseFloat(data.grade) > 0.78)

            const archive = archiver('zip')
            res.attachment('credentials.zip')
            archive.pipe(res)

            const browser = await puppeteer.launch({
                headless: true, // to avoid open windows
                printBackground: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // to avoid errors
              });

            for (const student of studentsDataPassed) {
                const dni = student.dni;
                const name = student.last_name + ' ' + student.first_name;
                const fileName = name + ' - ' + dni;
        
                const url = "http://localhost:3000/courses/credential/" + student.id;
        
                const page = await browser.newPage()
        
                await page.goto(url, { waitUntil: 'networkidle0' })
                await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
        
                const pdf = await page.pdf({ printBackground: true })
        
                await page.close();
        
                // Agregar el archivo PDF al archivo zip
                archive.append(pdf, { name: fileName + '.pdf' });
            }

            await browser.close();
            archive.finalize();

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    processCreateCourse: async(req,res) => {
        try{
            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('courses/createCourse',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Crear curso'
                })
            }

            //create course
            await db.Courses.create({
                course_name: req.body.courseName,
                url: req.body.url,
                enabled:1,
            })

            const successMessage = true
            
            return res.render('courses/createCourse',{title:'Crear curso', successMessage})
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    startCourse: async(req,res) => {
        try{
            const refLink = 'startCourse'
            const courses = await coursesQueries.courses()
            return res.render('courses/viewCourses',{title:'Iniciar curso',courses,refLink})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    studentsResults: async(req,res) => {
        try{
            const course = req.params.courseName
            const company = req.params.company

            //get course students
            const studentsData = await formsDataQueries.studentsDataFiltered(company,course)
            return res.render('courses/studentsResults',{title:'Resultados',course,studentsData})

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    viewCredential: async(req,res) => {
        try{
            const idFormData = req.params.idFormData

            //get data from idFormData
            const credentialData = await formsDataQueries.studentDataFiltered(idFormData)

            return res.render('courses/credential',{title:'Certificado',credentialData})

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    viewCourses: async(req,res) => {
        try{

            const refLink = 'viewForms'
            const courses = await coursesQueries.courses()
            
            return res.render('courses/viewCourses',{title:'Listado de cursos',courses,refLink})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    }
}


module.exports = coursesController

