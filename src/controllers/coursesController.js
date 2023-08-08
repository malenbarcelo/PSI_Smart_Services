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
const fs = require('fs')

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
            const courses = await coursesQueries.allCourses()

            return res.render('courses/certificateTemplate',{title:'Diseño de certificado',courses})
        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    createCertificateProcess: async(req,res) => {
        try{
            const courses = await coursesQueries.allCourses()

            const resultValidation = validationResult(req)

            console.log(req.body)

            if (resultValidation.errors.length > 0){                
                return res.render('courses/certificateTemplate',{
                    courses,
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Diseño de certificado'
                })
            }

            //create certificate
            await db.Certificates_templates.create({
                id_courses: req.body.selectCourse,
                logo1: 'logo1',
                logo2: 'logo2',
                logo3: 'logo3',
                type_of_course: req.body.selectTypeOfCourse,
                signature1_image: 'firma1',
                signature2_image: 'firma2',
                signature1_line1: req.body.signature1Line1,
                signature1_line2: erq.body.signature1Line2,
                signature2_line1: req.body.signature2Line1,
                signature2_line2: erq.body.signature2Line2,
                theory_hours:req.body.theoryHours,
                practice_hours:req.body.practiceHours,
                course_name: 'nombre del curso',
                text1: req.body.text1,
                text2: req.body.text2,
                enabled: 1
            })

            const successMessage = true

            return res.render('courses/certificateTemplate',{title:'Diseño de certificado',courses, successMessage})
            
            return res.render('courses/certificateTemplate',{title:'Diseño de certificado',courses})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    entryData: async(req,res) => {
        try{
            const idCourse = req.params.idCourse
            const course = await coursesQueries.courseName(idCourse) 
            return res.render('courses/entryData',{title:'Iniciar cuestionario',course,idCourse})
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

            //add data to coursesData
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

                //add courseId
                const courseId = await coursesQueries.courseId(course)
                coursesData[i].courseId = courseId
            }

            return res.render('courses/myCourses',{title:'Mis cursos',coursesData})

        }catch(error){
            return res.send('Ha ocurrido un error')
        }
    },
    openForm: async(req,res) => {
        try{

            const idCourse = req.params.idCourse
            const course = await coursesQueries.courseName(idCourse)

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                
                return res.render('courses/entryData',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Iniciar cuestionario',
                    course:course,
                    idCourse
                })
            }

            const courseUrl = await coursesQueries.courseUrl(idCourse)

            const image = await db.Profile_images.findOne({
                where:{
                    dni:req.body.dni,
                    id_courses: req.params.idCourse
                },
                raw:true
            })

            if (!image) {
                await db.Profile_images.create({
                    dni: req.body.dni,
                    id_courses: req.params.idCourse,
                    image: req.file.filename
                })
            }else{
                await db.Profile_images.update(
                    {
                      dni: req.body.dni,
                      id_courses: req.params.idCourse,
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
            const idCourse = req.params.idCourse
            const course = await coursesQueries.courseName(idCourse)
            const company = req.params.company  

            const resultValidation = validationResult(req)

            //get course students
            let studentsData = []
            if (req.session.userLogged.id_user_categories == 1) {
                studentsData = await formsDataQueries.studentsData(course)
            }else{
                studentsData = await formsDataQueries.studentsDataFiltered(company,course)
            }            
                
            let datesStrings = []

            for (let i = 0; i < studentsData.length; i++) {
                let dateString = await datesFunctions.dateToString(studentsData[i].date)
                datesStrings.push({"dateString":dateString})
            }

            if (resultValidation.errors.length > 0){

                return res.render('courses/studentsResults',{title:'Resultados',course,idCourse,studentsData,datesStrings,errors:resultValidation.mapped(),
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
            res.attachment(course + '.zip')
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
                    const fileName = data.company + '_Cred_ ' + name + '_' + dni;
            
                    const url = dominio + "courses/credentials/" + data.id;
            
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
                    const fileName = data.company + '_Cert_ ' + name + '_' + dni;
            
                    const url = dominio + "courses/certificates/" + data.id;
            
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
            const idCourse = req.params.idCourse
            const company = req.params.company
            const course = await coursesQueries.courseName(idCourse)

            //get course students
            let studentsData = []
           if (req.session.userLogged.id_user_categories == 1) {
            studentsData = await formsDataQueries.studentsData(course)
           }else{
            studentsData = await formsDataQueries.studentsDataFiltered(company,course)
           }
            
            let datesStrings = []

            for (let i = 0; i < studentsData.length; i++) {
                let dateString = await datesFunctions.dateToString(studentsData[i].date)
                datesStrings.push({"dateString":dateString})
            }

            return res.render('courses/studentsResults',{title:'Resultados',course,idCourse,studentsData,datesStrings})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    viewDocument: async(req,res) => {
        try{
            const idFormData = req.params.idFormData
            const typeOfDocument = req.params.typeOfDocument

            //get documents data
            const documentData = await formsDataQueries.studentDataFiltered(idFormData)
            
            //get course name
            const courseName = documentData.form_name

            //get course
            const courseData = await coursesQueries.filtrateCourse(courseName)

            //get course id
            const courseId = courseData.id

            //get certificate template
            const documentTemplate = await db.Documents_templates.findOne({
                where:{id_courses:courseId},
                raw:true
            })
            
            //get validity
            const validity =  courseData.validity

            //get expiration date
            const issueDate = documentData.date
            const issueDateString = await datesFunctions.dateToString(issueDate)
            var expirationDateString = '00/00/0000'

           if (validity != 0) {
                
                const expirationDate = new Date(issueDate)
                expirationDate.setMonth(expirationDate.getMonth() + validity)
                expirationDateString = await datesFunctions.dateToString(expirationDate);
            }
            
            //get student image
            const studentImage = await profileImagesQueries.imageName(documentData.dni,courseId)
            
            //get certificate code
            const courseCode = documentData.course_code
            const date2 = issueDateString.split('/')[0] + issueDateString.split('/')[1] + issueDateString.split('/')[2]
            const studentCode = documentData.student_code
            const documentCode = courseCode + '-' + date2 + '-' + studentCode

            //get month name
            const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Nomviembre','Diciembre']
            const month = documentData.date.getMonth()
            const issueMonth = months[month]
            
            if (typeOfDocument == 'certificates') {
                return res.render('courses/certificates',{title:'Certificado',documentCode,documentTemplate,documentData,issueMonth,issueDateString,expirationDateString,studentImage})
            }else{
                return res.render('courses/credentials',{title:'Credencial',documentCode,documentTemplate,documentData,issueDateString,expirationDateString,studentImage})
            }
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

