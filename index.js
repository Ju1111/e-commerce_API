const express = require('express')
const db = require('./models')

const app = express()
const port = process.env.PORT || 4001
const bodyParser = require('body-parser')

// const { Product } = db

const productsRouter = require('./products/router')
const usersRouter = require('./users/router')

app.use(bodyParser.json())

app.use(productsRouter)
app.use(usersRouter)

app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

app.listen(port, () => {
  console.log(`
    Server is listening on ${port}.

    Open http://localhost:${port}

    to see the app in your browser.
  `)
})

// Product.findById(1).then(product => console.log(JSON.stringify(product)))
