const User = require('./model')
const Router = require('express').Router
const bcrypt = require('bcrypt')
const secret = require('../jwt').secret

const router = new Router()

router.post('/users', (request, response) => {
  const user = {
  	email: request.body.email,
  	password: bcrypt.hashSync(request.body.password, 10)
  }
  User.create(user)
    .then(entity => {
      response.status(201)
      response.json({
        id: entity.id,
        email: entity.email
      })
    })
    .catch(err => {
      console.error(err)
      response.status(500).send({
        message: 'Something went wrong'
      })
  })
})

module.exports = router
