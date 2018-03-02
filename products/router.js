const Router = require('express').Router
const Product = require('./model')

const router = new Router()
const requireUser = (req, res, next) => {
	if (req.user) next()
	else res.status(401).send({
		message: 'Please login'
	})
}

router.get('/products', (request, response) => {
  const products = Product
  .findAll()
  .then((products) => {
    response.json(products)
  })
  .catch((err) => {
    console.error(err)
    response.status(500)
    response.json({ message : 'Oops! There was an error getting the products. Please try again.'})
  })
})

router.get('/products(:id)', (request, response) => {
  const products = Product
  .findById(request.params.id)
  .then((product) => {
    if (product) {
      response.json(product)
    }
    else  {
    response.status(404)
    response.json({ message: 'Product not found!'})
    }
  })
  .catch((err) => {
    console.error(err)
    response.status(500)
    response.json({ message : 'Oops! There was an error getting the products. Please try again.'})
  })
})

router.post('/products', requireUser, (request, response) => {
  const product = request.body
  console.log(product)
  // ... insert the new data into our database
  Product.create(product)
    .then(entity => {
      response.status(201)
      //send an empty response to the client
      response.json(entity)
    })
    .catch(err => {
      response.status(422)
      response.json({ message: err.message })
    })
})

const updateOrPatch = (request, respond) => {
  const productId = Number(request.params.id)
  const updates = request.body
}

router.put('/products/:id', requireUser, (request, response) => {
  const productId = Number(request.params.id)
  const updates = request.body

  // find the product in the DB
  Product.findById(request.params.id)
    .then(entity => {
      // change the product and store in DB
      return entity.update(updates)
    })
    .then(final => {
      // respond with the changed product and status code 200 OK
      response.send(final)
    })
    .catch(error => {
      response.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})

router.put('/products/:id', requireUser, updateOrPatch)
router.patch('/products/:id', requireUser, updateOrPatch)

router.delete('/products/:id', requireUser, (request, response) => {
  Product.findById(reuest.params.id)
  .then(entity => {
    return entity.destroy()
  })
  .then(() => {
    response.send({
      message: 'The product was deleted succesfully'
    })
  })
  .catch(error => {
    response.status(500).send({
      message: `Something went wrong`,
      error
    })
  })
})


module.exports = router
