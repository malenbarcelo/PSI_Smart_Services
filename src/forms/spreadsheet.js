const {GoogleSpreadsheet} = require('google-spreadsheet')
const credentials = require('./credentials.json')
let googleId = '1oa8vGumwnNF8zJyNpRXXQB2QPoxkIVfLv7zST0UZpa0'
const { google } = require('googleapis')

async function accessGoogleSheet(){
    const document = new GoogleSpreadsheet(googleId)
    await document.useServiceAccountAuth(credentials)
    await document.loadInfo()

    const sheet = document.sheetsByIndex[0]
    const data = await sheet.getRows()

    return data

}
async function accessGoogleDrive(){
    const oauth2Client = new google.auth.OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
      );

      
    client.setCredentials(credentials)
    const drive = google.drive({ version: 'v3', auth: client })
    const folderId = '1SV9x_CE6FqGwmoPS40L9I4apXuFL6u6BA'
    const response = await drive.files.list({
      pageSize: 10,
      q: `'${folderId}' in parents`,
      fields: 'files(name, id)',
    });

    const files = response.data.files
    console.log(files)
    res.json(files)

}

module.exports= {
    accessGoogleSheet:accessGoogleSheet,
    accessGoogleDrive:accessGoogleDrive,
    
}