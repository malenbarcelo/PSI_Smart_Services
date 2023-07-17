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
let prdConfigFile = configFile.replaceAll('root','psismart_malenbarcelo')
prdConfigFile = prdConfigFile.replaceAll('30941767Male-','30941767')
prdConfigFile = prdConfigFile.replaceAll('30941767','30941767Male-')
prdConfigFile = prdConfigFile.replaceAll('schema_db','malenbar_schema_sim')
fs.writeFileSync(config,prdConfigFile)

//Change .sql scripts from DEV to PRD
//Structure file
const structureDevPath = path.resolve('./campusAppData/sqlScripts/structureDEV.sql')
const structurePrdPath = path.resolve('./campusAppData/sqlScripts/structurePRD.sql')
const structureDevFile = fs.readFileSync(structureDevPath, 'utf-8')
const structurePrdFile = structureDevFile.replaceAll('schema_db','malenbar_schema_sim')
fs.writeFileSync(structurePrdPath,structurePrdFile)

//Data file
const dataDevPath = path.resolve('./campusAppData/sqlScripts/dataDEV.sql')
const dataPrdPath = path.resolve('./campusAppData/sqlScripts/dataPRD.sql')
const dataDevFile = fs.readFileSync(dataDevPath, 'utf-8')
const dataPrdFile = dataDevFile.replaceAll('schema_db','malenbar_schema_sim')
fs.writeFileSync(dataPrdPath,dataPrdFile)











