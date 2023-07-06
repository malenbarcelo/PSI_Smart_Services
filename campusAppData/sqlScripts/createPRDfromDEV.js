
//use this file to adapt dev files to prd files

const fs = require('fs');
const path = require('path');
const { clearScreenDown } = require('readline');

//Structure file
const structureDevPath = path.resolve('./structureDEV.sql')
const structurePrdPath = path.resolve('./structurePRD.sql')

const structureDevFile = fs.readFileSync(structureDevPath, 'utf-8')

const structurePrdFile = structureDevFile.replaceAll('schema_db','malenbar_schema_sim')

fs.writeFileSync(structurePrdPath,structurePrdFile)

//Data file
const dataDevPath = path.resolve('./dataDEV.sql')
const dataPrdPath = path.resolve('./dataPRD.sql')

const dataDevFile = fs.readFileSync(dataDevPath, 'utf-8')

const dataPrdFile = dataDevFile.replaceAll('schema_db','malenbar_schema_sim')

fs.writeFileSync(dataPrdPath,dataPrdFile)









