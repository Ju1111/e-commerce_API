const User = require('./model')
const Router = require('express').Router
const bcrypt = require('bcrypt')
const secret = require('../jwt').secret
const sign = require('../jwt').sign

const router = new Router()

router.get('/secret', (req, res) => {
	if (req.user) {
		res.send({
			message: `Welcome, you should be the user with email ${req.user.email}`
		})
	}
	else {
		res.status(401).send({
			message: 'Please login!'
		})
	}
})

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

router.post('/logins', (request, response) => {
  User.findOne({
		where: {
			email: request.body.email
		}
	})
	.then(entity => {
		if (bcrypt.compareSync(request.body.password, entity.password)) {
			response.send({
				jwt: sign(entity.id)
			})
		}
		else {
			response.status(400).send({
				message: 'Password was incorrect'
			})
		}
	})
	.catch(err => {
		console.error(err)
		response.status(500).send({
			message: 'Something went wrong'
		})
	})
})

module.exports = router
