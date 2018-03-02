const verify = require('./jwt').verify
const User = require('./users/model')
const express = require('express')
const db = require('./models')

const app = express()
const port = process.env.PORT || 4001
const bodyParser = require('body-parser')

// const { Product } = db

const productsRouter = require('./products/router')
const usersRouter = require('./users/router')

app.use(bodyParser.json())

app.use(function (request, response, next) {
  if (!request.headers.authorization) return next()

  const auth = request.headers.authorization.split(' ')
  if (auth[0] === 'Bearer') {
    verify(auth[1], function (err, jwt) {
      if (err) {
        console.error(err)
        response.status(400).send({
          message: "JWT token invalid"
        })
      }
      else {
        User
          .findById(jwt.id)
          .then(entity => {
            request.user = entity
            next()
          })
          .catch(err => {
            console.error(err)
            response.status(500).send({
              message: 'Something went horribly wrong'
            })
          })
      }
    })
  }
  else next()
})

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
