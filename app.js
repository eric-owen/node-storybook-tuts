const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

// load config
dotenv.config({ path: './config/config.env' })
require('./config/passport')(passport)

connectDB()

const app = express()

// for logging
if (process.env.NODE_ENV === 'developmennt') {
    app.use(morgan('dev'))
}

//handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// sessions
app.use(
    session({
        secret: 'keyboard car',
        resave: false,
        saveUninitialized: false,
    })
)
// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}`)
)
