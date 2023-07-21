//use this file to adapt dev files to prd files
const fs = require('fs');
const path = require('path');
const { clearScreenDown } = require('readline');

//Change dominio.js from 'http://localhost:3000' to 'https://psi-smart-services.wnpower.host'
const dominio = path.resolve('./public/js/dominio.js')
const devDominioFile = fs.readFileSync(dominio, 'utf-8')
const prdDominioFile = devDominioFile.replaceAll('http://localhost:3000','https://psi-smart-services.wnpower.host/')
fs.writeFileSync(dominio,prdDominioFile)

//Change config.js from DEV database to PRD database
const config = path.resolve('./database/config/config.js')
const configFile = fs.readFileSync(config, 'utf-8')
let prdConfigFile = configFile.replaceAll('root','psismart_user_psi') //In WNPower cPanel --> Bases de Datos MySQl --> Añadir usuario a la base de datos --> Usuario
prdConfigFile = prdConfigFile.replaceAll('30941767','psismartservices')
prdConfigFile = prdConfigFile.replaceAll('psi_db','psismart_psi_db')//In WNPower cPanel --> Bases de Datos MySQl --> Bases de datos actuales
fs.writeFileSync(config,prdConfigFile)

//Change .sql scripts from DEV to PRD
//Structure file
const structureDevPath = path.resolve('./sqlScripts/structureDEV.sql')
const structurePrdPath = path.resolve('./sqlScripts/structurePRD.sql')
const structureDevFile = fs.readFileSync(structureDevPath, 'utf-8')
const structurePrdFile = structureDevFile.replaceAll('psi_db','psismart_psi_db')
fs.writeFileSync(structurePrdPath,structurePrdFile)

//Data file
const dataDevPath = path.resolve('./sqlScripts/dataDEV.sql')
const dataPrdPath = path.resolve('./sqlScripts/dataPRD.sql')
const dataDevFile = fs.readFileSync(dataDevPath, 'utf-8')
const dataPrdFile = dataDevFile.replaceAll('psi_db','psismart_psi_db')
fs.writeFileSync(dataPrdPath,dataPrdFile)











