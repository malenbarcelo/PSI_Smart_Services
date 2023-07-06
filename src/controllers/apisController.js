const db = require('../../database/models')
const sequelize = require('sequelize')
const formsDataQueries = require('../functions/formsDataQueries')
const { google } = require('googleapis')

//Google drive APIs configuration
const credentials = require('../forms/credentials.json')
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
  studentsResults: async(req,res) =>{
    try{
      const course = req.params.courseName
      const company = req.params.company
      //get course students
      const studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      return res.status(200).json(studentsData)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResultsNotPassed: async(req,res) =>{
    try{
      const course = req.params.courseName
      const company = req.params.company
      //get course students
      const studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      const studentsDataNotPassed = studentsData.filter(data => parseFloat(data.grade) <= 0.78)
      return res.status(200).json(studentsDataNotPassed)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },
  studentsResultsPassed: async(req,res) =>{
    try{
      const course = req.params.courseName
      const company = req.params.company
      //get course students
      const studentsData = await formsDataQueries.studentsDataFiltered(company,course)
      const studentsDataPassed = studentsData.filter(data => parseFloat(data.grade) > 0.78)
      return res.status(200).json(studentsDataPassed)
    }catch(error){
      return res.send('Ha ocurrido un error')
    }
  },

    /*users: async(req,res) =>{
        const users = await db.Users.findAll({
            include:[{all:true}]
        })
        return res.status(200).json(users)
    },
    usersFiltered: async(req,res) =>{
        const idUser = req.params.idUser
        const userFiltered = await db.Users.findOne({
            where:{id:idUser}
        })
        return res.status(200).json(userFiltered)
    },
    questionTypes: async(req,res) =>{
        const questionTypes = await databaseData.questionTypes()
        return res.status(200).json(questionTypes)
    },
    studentFiltered: async(req,res) =>{
        const studentEmail = req.params.studentEmail
        const studentFiltered = await databaseData.findStudent(studentEmail)
        return res.status(200).json(studentFiltered)
    },
    coursesResults: async(req,res) =>{
        const courseResults = await databaseData.coursesResults()
        return res.status(200).json(courseResults)
    },
    */
}
module.exports = apisController

