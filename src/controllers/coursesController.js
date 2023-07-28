const db = require('../../database/models')
const path = require('path')
const {validationResult} = require('express-validator')
const formsDataQueries = require('../functions/formsDataQueries')
const coursesQueries = require('../functions/coursesQueries')
const datesFunctions = require('../functions/datesFunctions')
const profileImagesQueries = require('../functions/profileImagesQueries')
const sequelize = require('sequelize')
const puppeteer = require('puppeteer')
const archiver = require('archiver')
const fetch = require('cross-fetch')
const dominio = require('../functions/dominio')
const ejs = require('ejs')
const { chromium } = require('playwright')
const fs = require('fs/promises')

const coursesController = {
    createCourse: async(req,res) => {
        try{
            return res.render('courses/createCourse',{title:'Crear curso'})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    createCertificate: async(req,res) => {
        try{
            return res.render('courses/certificateTemplate',{title:'Diseño de certificado'})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    entryData: async(req,res) => {
        try{
            const course = req.params.courseName
            return res.render('courses/entryData',{title:'Iniciar cuestionario',course})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    myCourses: async(req,res) => {
        try{
            //get courses to show
            
            let coursesData = []
            let company = ''
            let students = ''            

            if (req.session.userLogged.id_user_categories == 1){
                coursesData = await coursesQueries.courses() //all courses

            }else{
                company = req.session.userLogged.company
                coursesData = await formsDataQueries.coursesFiltered(company)
            }

            //add students qty to coursesData
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
                coursesData[i].passedPercentage = students.length == 0 ? 0 : (passed / students.length * 100).toFixed(2)
                coursesData[i].notPassed = notPassed
                coursesData[i].notPassedPercentage = students.length == 0 ? 0 : (notPassed / students.length * 100).toFixed(2)

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
    openForm: async(req,res) => {
        try{
            const course = req.params.courseName
            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                
                return res.render('courses/entryData',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Iniciar cuestionario',
                    course:course
                })
            }

            const courseUrl = await coursesQueries.courseUrl(req.params.courseName)

            const image = await db.Profile_images.findOne({
                where:{
                    dni:req.body.dni,
                    course:req.params.courseName
                },
                raw:true
            })

            if (!image) {
                await db.Profile_images.create({
                    dni: req.body.dni,
                    course: req.params.courseName,
                    image: req.file.filename
                })
            }else{
                await db.Profile_images.update(
                    {
                      dni: req.body.dni,
                      course: req.params.courseName,
                      image: req.file.filename
                    },
                    {
                      where: { id: image.id }
                    }
                  )
            }

            return res.send("<script>window.location.href = '" + courseUrl.url + "';</script>");
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
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
                headless: "new", // to avoid open windows
                printBackground: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // to avoid errors
              });

            for (const student of studentsDataPassed) {
                const dni = student.dni;
                const name = student.last_name + ' ' + student.first_name;
                const fileName = name + ' - ' + dni;
        
                const url = dominio +  "courses/view-credential/" + student.id;
        
                const page = await browser.newPage()
        
                await page.goto(url, { waitUntil: 'networkidle0' })
                await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
        
                const pdf = await page.pdf({ printBackground: true })
        
                await page.close();
        
                // Agregar el archivo PDF al archivo zip
                archive.append(pdf, { name: fileName + '.pdf' });
            }

            archive.finalize()
            res.end()
            await browser.close()

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    printSelected: async(req,res) =>{
        try{
            //get course and company
            const course = req.params.courseName
            const company = req.params.company

            const resultValidation = validationResult(req)

            //get course students
            let studentsData = await formsDataQueries.studentsDataFiltered(company,course)
                
            let datesStrings = []

            for (let i = 0; i < studentsData.length; i++) {
                let dateString = await datesFunctions.dateToString(studentsData[i].date)
                datesStrings.push({"dateString":dateString})
            }

            if (resultValidation.errors.length > 0){

                return res.render('courses/studentsResults',{title:'Resultados',course,studentsData,datesStrings,errors:resultValidation.mapped(),
                oldData: req.body,})
            }

            const body = Object.keys(req.body)
            const promises = []

            //get idFormsData to print and documents to print
            var idsFormsData = []
            var documents = []
            
            for (let i = 0; i < body.length; i++) {
                if (body[i] == "certificates" || body[i] == "credentials") {
                    documents.push(body[i])
                }else{
                    if (body[i] != "selectAll") {
                        idsFormsData.push(body[i])
                    }
                }
            }

            //get dataToPrint to print
            const dataToPrint = await formsDataQueries.dataToPrint(idsFormsData)

            //create .zip

            const archive = archiver('zip')
            res.attachment('credentials.zip')
            archive.pipe(res)

            const browser = await chromium.launch()

            //print credentials if necessary
            if (documents.includes('credentials')) {
                for (const data of dataToPrint) {
                    const dni = data.dni;
                    const name = data.last_name + ' ' + data.first_name;
                    const fileName = 'Credencial ' + name + ' - ' + dni;
            
                    const url = dominio + "courses/view-credential/" + data.id;
            
                    const page = await browser.newPage()            
                    await page.goto(url, { waitUntil: 'domcontentloaded' })
                    
            
                    const pdf = await page.pdf({
                        format: 'A4',
                        printBackground: true, 
                      });
            
                    await page.close();
            
                    // Agregar el archivo PDF al archivo zip
                    //archive.append(pdf, { name: fileName + '.pdf' });

                    // Agregar el archivo PDF al archivo zip desde el buffer
                    const pdfPromise = new Promise((resolve, reject) => {
                        archive.append(pdf, { name: fileName }, (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve()
                            }
                        });
                    });
                    promises.push(pdfPromise)
                }
            }

            //print certificates if necessary
            if (documents.includes('certificates')) {
                for (const data of dataToPrint) {
                    const dni = data.dni;
                    const name = data.last_name + ' ' + data.first_name;
                    const fileName = 'Certificado ' + name + ' - ' + dni;
            
                    const url = dominio + "courses/view-certificate/" + data.id;
            
                    const page = await browser.newPage()            
                    await page.goto(url, { waitUntil: 'domcontentloaded' })
                                
                    const pdf = await page.pdf({
                        format: 'A4',
                        printBackground: true, 
                      });
            
                    await page.close();
            
                    // Agregar el archivo PDF al archivo zip
                    //archive.append(pdf, { name: fileName + '.pdf' });

                    // Agregar el archivo PDF al archivo zip desde el buffer
                    const pdfPromise = new Promise((resolve, reject) => {
                        archive.append(pdf, { name: fileName }, (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve()
                            }
                        });
                    });
                    promises.push(pdfPromise)
                }
            }
            
            archive.finalize()            
            await browser.close()

            res.on('close', () => {
                console.log('Respuesta HTTP cerrada');
            })

            archive.on('end', () => {
                console.log('Archivo ZIP completado');
                res.end(); // Finalizar la respuesta HTTP una vez que el archivo ZIP esté completo
              })
            
        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    printSelected2: async(req,res) =>{
        try{
            //get course and company
            const course = req.params.courseName
            const company = req.params.company

            const resultValidation = validationResult(req)

            //get course students
            let studentsData = await formsDataQueries.studentsDataFiltered(company,course)
                
            let datesStrings = []

            for (let i = 0; i < studentsData.length; i++) {
                let dateString = await datesFunctions.dateToString(studentsData[i].date)
                datesStrings.push({"dateString":dateString})
            }

            if (resultValidation.errors.length > 0){

                return res.render('courses/studentsResults',{title:'Resultados',course,studentsData,datesStrings,errors:resultValidation.mapped(),
                oldData: req.body,})
            }

            const body = Object.keys(req.body)

            //get idFormsData to print and documents to print
            var idsFormsData = []
            var documents = []
            
            for (let i = 0; i < body.length; i++) {
                if (body[i] == "certificates" || body[i] == "credentials") {
                    documents.push(body[i])
                }else{
                    if (body[i] != "selectAll") {
                        idsFormsData.push(body[i])
                    }
                }
            }

            //get dataToPrint to print
            const dataToPrint = await formsDataQueries.dataToPrint(idsFormsData)

            //create .zip

            const archive = archiver('zip')
            res.attachment('credentials.zip')
            archive.pipe(res)

            const browser = await puppeteer.launch({
                headless: "new", // to avoid open windows
                printBackground: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // to avoid errors
              });

            //print credentials if necessary
            if (documents.includes('credentials')) {
                for (const data of dataToPrint) {
                    const dni = data.dni;
                    const name = data.last_name + ' ' + data.first_name;
                    const fileName = 'Credencial ' + name + ' - ' + dni;
            
                    const url = dominio + "courses/view-credential/" + data.id;
            
                    const page = await browser.newPage()
            
                    await page.goto(url, { waitUntil: 'networkidle0' })
                    await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
            
                    const pdf = await page.pdf({ printBackground: true })
            
                    await page.close();
            
                    // Agregar el archivo PDF al archivo zip
                    archive.append(pdf, { name: fileName + '.pdf' });
                }
            }

            //print certificates if necessary
            if (documents.includes('certificates')) {
                for (const data of dataToPrint) {
                    const dni = data.dni;
                    const name = data.last_name + ' ' + data.first_name;
                    const fileName = 'Certificado ' + name + ' - ' + dni;
            
                    const url = dominio + "courses/view-certificate/" + data.id;
            
                    const page = await browser.newPage()
            
                    await page.goto(url, { waitUntil: 'networkidle0' })
                    await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
            
                    const pdf = await page.pdf({ printBackground: true, landscape: true })
            
                    await page.close();
            
                    // Agregar el archivo PDF al archivo zip
                    archive.append(pdf, { name: fileName + '.pdf' });
                }
            }
            
            await browser.close()
            archive.finalize()

        }catch(error){
            console.log(error)
            return res.send(error)
        }
    },
    printSelectedCredentials: async(req,res) =>{
        try{

            let credentialsToPrint = req.body
            credentialsToPrint = Object.keys(credentialsToPrint)

            const company = req.params.company
            const course = req.params.course
            
            //get credentials to print
            const dataCredentialsToPrint = await formsDataQueries.dataCredentialsToPrint(credentialsToPrint)

            const archive = archiver('zip')
            res.attachment('credentials.zip')
            archive.pipe(res)

            const browser = await puppeteer.launch({
                headless: true, // to avoid open windows
                printBackground: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // to avoid errors
              });

            for (const data of dataCredentialsToPrint) {
                const dni = data.dni;
                const name = data.last_name + ' ' + data.first_name;
                const fileName = name + ' - ' + dni;
        
                const url = dominio + "courses/view-credential/" + data.id;
        
                const page = await browser.newPage()
        
                await page.goto(url, { waitUntil: 'networkidle0' })
                await page.emulateMediaFeatures([{ name: 'color-gamut', value: 'srgb' }])
        
                const pdf = await page.pdf({ printBackground: true })
        
                await page.close();
        
                // Agregar el archivo PDF al archivo zip
                archive.append(pdf, { name: fileName + '.pdf' });
            }

            await browser.close()
            archive.finalize()
  
            
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
                validity: req.body.validity,
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
            const courses = await coursesQueries.allCourses()
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
            let studentsData = await formsDataQueries.studentsDataFiltered(company,course)
            
            let datesStrings = []

            for (let i = 0; i < studentsData.length; i++) {
                let dateString = await datesFunctions.dateToString(studentsData[i].date)
                datesStrings.push({"dateString":dateString})
            }

            return res.render('courses/studentsResults',{title:'Resultados',course,studentsData,datesStrings})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    viewCertificate: async(req,res) => {
        try{
            const idFormData = req.params.idFormData                        

            //get certificate data
            const certificateData = await formsDataQueries.studentDataFiltered(idFormData)

            //get course name
            const courseName = certificateData.form_name

            //get course
            const courseData = await coursesQueries.filtrateCourse(courseName) 

            //get course id
            const courseId = courseData.id

            //get certificate template
            const certificateTemplate = await db.Certificates_templates.findOne({
                where:{id_courses:courseId},
                raw:true
            })

            //get validity
            const validity =  courseData.validity

            //get expiration date
            const issueDate = certificateData.date
            const issueDateString = await datesFunctions.dateToString(issueDate)
            const expirationDateTimestamp =  issueDate.setMonth(issueDate.getMonth() + validity)
            const expirationDate = new Date(expirationDateTimestamp)
            const expirationDateString = await datesFunctions.dateToString(expirationDate)

            //get student image
            const studentImage = await profileImagesQueries.imageName(certificateData.dni,courseName)
            
            //get certificate code
            const courseCode = certificateData.course_code
            const date = issueDateString.split('/')[0] + issueDateString.split('/')[1] + issueDateString.split('/')[2]
            const studentCode = certificateData.student_code
            const certificateCode = courseCode + '-' + date + '-' + studentCode

            //get month name
            const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Nomviembre','Diciembre']
            const month = certificateData.date.getMonth()
            const issueMonth = months[month]

            //get header Line 1 depending on the type of course
            var headerLine1 = ''
            if (certificateTemplate.theory_hours != 0 && certificateTemplate.practice_hours != 0) {
                headerLine1 = 'Certificado de aprobación curso teórico-práctico'
            }else{
                if (certificateTemplate.theory_hours == 0) {
                    headerLine1 = 'Certificado de aprobación curso práctico'
                }else{
                    headerLine1 = 'Certificado de aprobación curso teórico'
                }
            }

            //get certificate Line 1 depending on the type of course
            var certificateLine1 = ''
            if (certificateTemplate.theory_hours != 0 && certificateTemplate.practice_hours != 0) {
                certificateLine1 = 'Aprobó el curso teórico (' + certificateTemplate.theory_hours + 'hs) / práctico (' + certificateTemplate.practice_hours + 'hs)'
            }else{
                if (certificateTemplate.theory_hours == 0) {
                    certificateLine1 = 'Aprobó el curso práctico (' + certificateTemplate.practice_hours + 'hs)'
                }else{
                    certificateLine1 = 'Aprobó el curso teórico (' + certificateTemplate.theory_hours + 'hs)'
                }
            }

            return res.render('courses/certificates',{title:'Certificado',headerLine1,certificateLine1,certificateCode,certificateTemplate,certificateData,issueMonth,issueDateString,expirationDateString,studentImage})
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    viewCredential: async(req,res) => {
        try{
            const idFormData = req.params.idFormData                        

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
            

            return res.render('courses/credentials',{title:'Credencial',credentialCode,credentialTemplate,credentialData,issueDateString,expirationDateString,studentImage})

            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    viewCourses: async(req,res) => {
        try{

            const refLink = 'viewForms'
            const courses = await coursesQueries.allCourses()
            
            return res.render('courses/viewCourses',{title:'Listado de cursos',courses,refLink})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    viewStudents: async(req,res) => {
        try{

            const company = req.session.userLogged.company
            const studentsData = await formsDataQueries.companyStudents(company)

            let selectList = []

            studentsData.forEach(student => {
                selectList.push({"name":student.last_name + ', ' + student.first_name,"dni":student.dni})
            });

            //remove dulpicates
            function areObjectsEqual(obj1, obj2) {
                return obj1.name === obj2.name && obj1.dni === obj2.dni;
              }
              
              const uniqueSelectList = selectList.filter((item, index, self) => {
                return self.findIndex((obj) => areObjectsEqual(obj, item)) === index;
              });

            return res.render('courses/viewStudents',{title:'Mis alumnos',uniqueSelectList})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}


module.exports = coursesController

