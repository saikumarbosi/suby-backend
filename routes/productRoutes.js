const productController = require('../controllers/productController')
const express = require('express')
const productRouter = express.Router()

productRouter.post('/add-product/:id', productController.addProduct)
productRouter.get('/:firmId/products', productController.getProductsByFirmId)
productRouter.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName 
    res.headersSent("Content-Type", "image/jpeg")
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName))
})
productRouter.delete('/:id', productController.deleteProductById)

module.exports = productRouter