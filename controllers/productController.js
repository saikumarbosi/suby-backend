const Product = require('../models/Product')
const Firm = require('../models/Firm')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination folder for the uploaded images
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Define the filename for the uploaded images
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addProduct = async(req, res) => {
    try {
        const {productName, price, category, bestSeller, description} = req.body
        const image = req.file? req.file.filename: undefined
        const firm = await Firm.findById(req.params.id)
        if(!firm){
            return res.status(400).send("Firm Not Found")
        }
        const product = new Product({productName, price, category, bestSeller, description, image, firm: firm._id})
        const savedProduct = await product.save()
        firm.products.push(savedProduct)
        await firm.save()
        res.status(200).json(product)
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const getProductsByFirmId = async(req, res) => {
    try {
        const firmId = req.params.firmId
        const firm = await Firm.findById(firmId)
        if(!firm){
            return res.status(400).send("Firm Not Found")
        }
        const products = await Product.find({firm: firmId})
        const firmName = firm.firmname
        res.status(200).json({firmName, products})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const deleteProductById = async(req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id)
        if(!deleteProduct){
            return res.status(400).send("Product not delete")
        }
        res.status(200).send("Deleted Successfully")
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

module.exports = {addProduct: [upload.single('image'), addProduct], getProductsByFirmId, deleteProductById}
