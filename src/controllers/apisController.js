const db = require('../../database/models')
const sequelize = require('sequelize')
const formsDataQueries = require('../functions/formsDataQueries')
const { google } = require('googleapis')

//Google drive APIs configuration
const credentials = require('../forms/credentials.json')
const dateFunctions = require('../functions/datesFunctions')
const clientID = credentials.web.client_id;
const clientSecret = credentials.web.client_secret;
const redirectURL = credentials.web.redirect_uris[0];
const oAuth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURL);
const authURL = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.readonly'] // Define los permisos necesarios según tus requisitos
});

const apisController = {
  driveFiles: async(req,res) =>{
    const code = req.query.code;
  
    if (code) {
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
  
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  
        const response = await drive.files.list({
          q: `'1GLa6MTGbTfVgIwLXb_RPRLi0l40kX_qd' in parents`, //folderId
          fields: 'files(id,name, mimeType, webViewLink)',
        });
  
        const files = response.data.files.map(file => ({
          id:file.id,
          name: file.name,
          mimeType: file.mimeType,
          link: file.webViewLink,
        }));
  
        res.status(200).json(files)

      } catch (error) {
        console.error('Error al obtener la lista de archivos:', error);
        res.status(500).json({ error: 'Error al obtener la lista de archivos' });
      }
    } else {
      res.redirect(authURL);
    }        
},
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
      
      //get course students
      let studentsData = []
      if (req.session.userLogged.id_user_categories == 1) {
        studentsData = await formsDataQueries.studentsData(course)
      }else{
        studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      }

      const studentsDataNotPassed = studentsData.filter(data => parseFloat(data.grade) <= 0.78)

      //add date as string
      const newDataArray = await Promise.all(studentsDataNotPassed.map(async (element) => {
        const dateString = await dateFunctions.dateToString(element.date);
        return {
          ...element.dataValues,
          dateString: dateString, 
        }
      }))

      return res.status(200).json(newDataArray)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResultsPassed: async(req,res) =>{
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
      
      const studentsDataPassed = studentsData.filter(data => parseFloat(data.grade) > 0.78)

      //add date as string
      const newDataArray = await Promise.all(studentsDataPassed.map(async (element) => {
        const dateString = await dateFunctions.dateToString(element.date);
        return {
          ...element.dataValues,
          dateString: dateString, 
        }
      }))

      return res.status(200).json(newDataArray)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisController

