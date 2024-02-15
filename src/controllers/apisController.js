const db = require('../../database/models')
const sequelize = require('sequelize')
const formsDataQueries = require('../functions/formsDataQueries')
const coursesQueries = require('../functions/coursesQueries')
const dateFunctions = require('../functions/datesFunctions')
const { google } = require('googleapis')

const apisController = {

  studentData: async(req,res) =>{
    try{
      const company = req.params.company
      const dni = req.params.dni

      //get student data
      const studentData = await formsDataQueries.studentData(company,dni)

      return res.status(200).json(studentData)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResults: async(req,res) =>{
    try{
      const course = req.params.courseName
      const company = req.params.company

      //get course students
      let studentsData = []
      if (req.session.userLogged.id_user_categories == 1) {
        studentsData = await formsDataQueries.studentsData(course)
      }else{
        studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      }

      //add date as string
      const newDataArray = await Promise.all(studentsData.map(async (element) => {
        const dateString = await dateFunctions.dateToString(element.date);
        return {
          ...element.dataValues,
          dateString: dateString, 
        };
      }));

      //get course associations
      const courseId = await coursesQueries.courseId(course)
      const courseAssociations = await coursesQueries.courseAssociations(courseId)

      //get course data
      const courseData = await coursesQueries.courseData(courseId)
      

      //get course associations names
      for (let i = 0; i < courseAssociations.length; i++) {
        const courseName = await coursesQueries.courseName(courseAssociations[i].id_associated_form)
        courseAssociations[i].courseName = courseName
      }

      //add students data to associated forms data
      const today = new Date()
      today.setDate(today.getDate() - 180)
      
      for (let i = 0; i <courseAssociations.length; i++) {
        const courseName2 = courseAssociations[i].courseName
        var dataToAssociate = []
        if (req.session.userLogged.id_user_categories == 1) {
          dataToAssociate = await formsDataQueries.studentsData(courseName2)
        }else{
          dataToAssociate = await formsDataQueries.studentsDataFiltered(company,courseName2)
        }
        //filter las 6 months
        const dataToAssociateFiltered = dataToAssociate.filter(data => data.date >= today)
        courseAssociations[i].data = dataToAssociateFiltered
      }

      //add associated forms and pass grade to data
      for (let i = 0; i < newDataArray.length; i++) {
        var dni = newDataArray[i].dni
        newDataArray[i].pass_grade = courseData.pass_grade
        newDataArray[i].associatedForms = []
        for (let j = 0; j < courseAssociations.length; j++) {
          const formName = courseAssociations[j].courseName
          const formData = courseAssociations[j].data
          var studentData = formData.filter(student => student.dni === dni)
          var grade = studentData.length == 0 ? 'NA' : studentData[0].grade
          newDataArray[i].associatedForms.push({'formName':formName,'grade':grade })        
        }
      }      

      return res.status(200).json(newDataArray)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResultsNotPassed: async(req,res) =>{
    try{

      const course = req.params.courseName
      const company = req.params.company

      const courseId = await coursesQueries.courseId(course)
      const courseData = await coursesQueries.courseData(courseId)

      //get course students
      let studentsData = []
      if (req.session.userLogged.id_user_categories == 1) {
        studentsData = await formsDataQueries.studentsData(course)
      }else{
        studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      }

      const studentsDataNotPassed = studentsData.filter(data => parseFloat(data.grade) < parseFloat(courseData.pass_grade)/100)

      //add date as string
      const newDataArray = await Promise.all(studentsDataNotPassed.map(async (element) => {
        const dateString = await dateFunctions.dateToString(element.date);
        return {
          ...element.dataValues,
          dateString: dateString, 
        };
      }));

      //get course associations
      const courseAssociations = await coursesQueries.courseAssociations(courseId)

      //get course associations names
      for (let i = 0; i < courseAssociations.length; i++) {
        const courseName = await coursesQueries.courseName(courseAssociations[i].id_associated_form)
        courseAssociations[i].courseName = courseName
      }

      //add students data to associated forms data
      const today = new Date()
      today.setDate(today.getDate() - 180)
      
      for (let i = 0; i <courseAssociations.length; i++) {
        const courseName2 = courseAssociations[i].courseName
        var dataToAssociate = []
        if (req.session.userLogged.id_user_categories == 1) {
          dataToAssociate = await formsDataQueries.studentsData(courseName2)
        }else{
          dataToAssociate = await formsDataQueries.studentsDataFiltered(company,courseName2)
        }
        //filter las 6 months
        const dataToAssociateFiltered = dataToAssociate.filter(data => data.date >= today)
        courseAssociations[i].data = dataToAssociateFiltered
      }

      //add associated forms to data
      for (let i = 0; i < newDataArray.length; i++) {
        var dni = newDataArray[i].dni
        newDataArray[i].pass_grade = courseData.pass_grade
        newDataArray[i].associatedForms = []
        for (let j = 0; j < courseAssociations.length; j++) {
          const formName = courseAssociations[j].courseName
          const formData = courseAssociations[j].data
          var studentData = formData.filter(student => student.dni === dni)
          var grade = studentData.length == 0 ? 'NA' : studentData[0].grade
          newDataArray[i].associatedForms.push({'formName':formName,'grade':grade })
        }
      }
      
      return res.status(200).json(newDataArray)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResultsPassed: async(req,res) =>{
    try{
      const course = req.params.courseName
      const company = req.params.company

      const courseId = await coursesQueries.courseId(course)
      const courseData = await coursesQueries.courseData(courseId)
            
      //get course students
      let studentsData = []
      if (req.session.userLogged.id_user_categories == 1) {
        studentsData = await formsDataQueries.studentsData(course)
      }else{
        studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      }

      const studentsDataPassed = studentsData.filter(data => parseFloat(data.grade) >= parseFloat(courseData.pass_grade)/100)

      //add date as string
      const newDataArray = await Promise.all(studentsDataPassed.map(async (element) => {
        const dateString = await dateFunctions.dateToString(element.date);
        return {
          ...element.dataValues,
          dateString: dateString, 
        };
      }));

      //get course associations
      const courseAssociations = await coursesQueries.courseAssociations(courseId)

      //get course associations names
      for (let i = 0; i < courseAssociations.length; i++) {
        const courseName = await coursesQueries.courseName(courseAssociations[i].id_associated_form)
        courseAssociations[i].courseName = courseName
      }

      //add students data to associated forms data
      const today = new Date()
      today.setDate(today.getDate() - 180)
      
      for (let i = 0; i < courseAssociations.length; i++) {
        const courseName2 = courseAssociations[i].courseName
        var dataToAssociate = []
        if (req.session.userLogged.id_user_categories == 1) {
          dataToAssociate = await formsDataQueries.studentsData(courseName2)
        }else{
          dataToAssociate = await formsDataQueries.studentsDataFiltered(company,courseName2)
        }
        //filter las 6 months
        const dataToAssociateFiltered = dataToAssociate.filter(data => data.date >= today)
        courseAssociations[i].data = dataToAssociateFiltered
      }

      //add associated forms to data and pass grade
      for (let i = 0; i < newDataArray.length; i++) {
        var dni = newDataArray[i].dni
        newDataArray[i].pass_grade = courseData.pass_grade
        newDataArray[i].associatedForms = []
        for (let j = 0; j < courseAssociations.length; j++) {
          const formName = courseAssociations[j].courseName
          const formData = courseAssociations[j].data
          var studentData = formData.filter(student => student.dni === dni)
          var grade = studentData.length == 0 ? 'NA' : studentData[0].grade
          newDataArray[i].associatedForms.push({'formName':formName,'grade':grade })
        }
      }
      
      return res.status(200).json(newDataArray)
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisController

