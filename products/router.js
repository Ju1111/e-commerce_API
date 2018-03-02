const Router = require('express').Router
const Product = require('./model')

const router = new Router()

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

router.post('/products', (request, response) => {
  const product = req.body
  console.log(product)
  // ... insert the new data into our database
  Product.create(product)
    .then(entity => {
      res.status(201)
      //send an empty response to the client
      res.json(entity)
    })
    .catch(err => {
      res.status(422)
      res.json({ message: err.message })
    })
})

const updateOrPatch = (request, respond) => {
  const productId = Number(req.params.id)
  const updates = req.body
}

router.put('/products/:id', (request, response) => {
  const productId = Number(req.params.id)
  const updates = req.body

  // find the product in the DB
  Product.findById(req.params.id)
    .then(entity => {
      // change the product and store in DB
      return entity.update(updates)
    })
    .then(final => {
      // respond with the changed product and status code 200 OK
      res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})

router.put('/products/:id', updateOrPatch)
router.patch('/products/:id', updateOrPatch)

router.delete('/products/:id', (request, response) => {
  Product.findById(req.params.id)
  .then(entity => {
    return entity.destroy()
  })
  .then(() => {
    res.send({
      message: 'The product was deleted succesfully'
    })
  })
  .catch(error => {
    res.status(500).send({
      message: `Something went wrong`,
      error
    })
  })
})


module.exports = router
