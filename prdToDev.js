//use this file to adapt prd files to dev files
const fs = require('fs');
const path = require('path');
const { clearScreenDown } = require('readline');

//Change dominio.js from 'http://localhost:3000' to 'https://psi-smart-services.wnpower.host'
const dominio = path.resolve('./public/js/dominio.js')
const devDominioFile = fs.readFileSync(dominio, 'utf-8')
const prdDominioFile = devDominioFile.replaceAll('https://psi-smart-services.wnpower.host','http://localhost:3000')
fs.writeFileSync(dominio,prdDominioFile)

//Change config.js from DEV database to PRD database
const config = path.resolve('./database/config/config.js')
const configFile = fs.readFileSync(config, 'utf-8')
let prdConfigFile = configFile.replaceAll('psismart_userpsi','root')
prdConfigFile = prdConfigFile.replaceAll('psismartservices','30941767')
prdConfigFile = prdConfigFile.replaceAll('psismart_psi_db','psi_db')
fs.writeFileSync(config,prdConfigFile)

