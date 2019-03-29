const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const uuidv1 = require('uuid/v1')
const path = require('path')
var session = require('express-session')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

const VIEWS_PATH = path.join(__dirname, '/views');
console.log(VIEWS_PATH)
// tell express to use mustache template engine
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
// the pages are located in the views dir
app.set('views','./views')
// the extension will be .mustache
app.set('view engine','mustache')

let trips = []
//rendering index page
app.get('/', (req,res) => {
  res.render('index')
})
//rendering page to show trips
app.get('/trip-info',(req,res) => {
  res.render('trip-info',{trips: trips})
})
//adding a trip
app.post('/add-trip',(req,res) => {
  let destination = req.body.destination
  let departureDate = req.body.departureDate
  let returnDate = req.body.returnDate
  let destinationImgURL = req.body.destinationImgURL

  let trip = {destination: destination,
              departureDate: departureDate,
              returnDate: returnDate,
              destinationImgURL: destinationImgURL,
              id:uuidv1()}

  trips.push(trip)
  res.redirect('/trip-info')
})
// deleting a trip
app.post('/delete-trip',(req,res) => {
  let uuid = req.body.tripID

  trips = trips.filter(function(trip) {
    return trip.id != uuid
  })
  res.redirect('/trip-info')
})
//users array


app.get('/login',(req,res) => {
  res.render('login')
})
let users = []
// register for the site
app.post('/register',(req,res) => {
  let userName = req.body.userName
  let password = req.body.password

  let user = {
          userName: userName,
          password: password
            }
  users.push(user)
  res.redirect('/login')
})
// log in to the site
app.post('/login',(req,res) => {

  let userName = req.body.userName
  let password = req.body.password

  let persistedUser = users.find((user) => {
    return user.userName == userName && user.password == password
  })
  if(persistedUser) {
    if(req.session) {
      req.session.userName = persistedUser.userName
      res.redirect('/')
    }
  }else {
    res.render('login', {message: 'Invalid login!'})
  }
})







app.listen(3000,() => {
  console.log('server is a go!')
})
