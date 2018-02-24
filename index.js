const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const db = require('./app/models')
const PORT = process.env.PORT || 3000
const app = express()

//Handlebars View Engine
app.engine('hbs', exphbs({
	defaultLayout: path.join(__dirname, 'app/views/layouts/main'), 
    extname: '.hbs',
    helpers: {
        sections:  /* istanbul ignore next */ function(name, options){
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        }
    }
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'app/views'))

//Middleware for Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Static Files
app.use('/static', express.static(path.join(__dirname, '/app/public')))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'This is the Title'
    })
})


let hostRoutes = require('./app/controllers/hostController');
app.use(hostRoutes)

db.sequelize.sync().then(function () {
    app.listen(PORT, () => console.log('and runnin runnin and runnin runnin'))
})
module.exports = app