//use this file to adapt dev files to prd files
const fs = require('fs');
const path = require('path');
const { clearScreenDown } = require('readline');

//Change dominio.js from 'http://localhost:3000' to 'https://malenbarcelo.wnpower.host'
const dominio = path.resolve('./public/js/dominio.js')
const devDominioFile = fs.readFileSync(dominio, 'utf-8')
const prdDominioFile = devDominioFile.replaceAll('https://campus.schemasim.com/','http://localhost:3000')
fs.writeFileSync(dominio,prdDominioFile)

//Change config.js from DEV database to PRD database
const config = path.resolve('./database/config/config.js')
const configFile = fs.readFileSync(config, 'utf-8')
let prdConfigFile = configFile.replaceAll('malenbar_malenbarcelo','root')
prdConfigFile = prdConfigFile.replaceAll('30941767Male-','30941767')
prdConfigFile = prdConfigFile.replaceAll('malenbar_schema_sim','schema_db')
fs.writeFileSync(config,prdConfigFile)

