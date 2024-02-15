const express = require('express')
const path = require('path')
const publicPath =  path.resolve('./public')
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware.js')
const apisRoutes = require('./src/routes/apisRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')
const coursesRoutes = require('./src/routes/coursesRoutes.js')
const { google } = require('googleapis')
const dotenv = require('dotenv')

const app = express()

//use public as statis
app.use(express.static(publicPath))

//use cors to allow any website to connet to my app
app.use(cors())

//get forms info as objects
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//set views folder in src/views
app.set('views', path.join(__dirname, 'src/views'));

//set templates extension (ejs)
app.set('view engine','ejs')

//configure session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
}))

//middlewares
app.use(userLoggedMiddleware)

//Declare and listen port
const APP_PORT = 3000
app.listen(APP_PORT,() => console.log("Servidor corriendo en puerto " + APP_PORT))

//Routes
app.use('/',usersRoutes)
app.use('/apis',apisRoutes)
app.use('/users',usersRoutes)
app.use('/courses',coursesRoutes)

