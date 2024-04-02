const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')

const verifyToken = async(req, res, next) => {
    const token = req.headers.token
    if(!token){
        return res.status(400).send("token not found")
    }
    try {
        const decode = jwt.verify(token, "jwtToken")
        // console.log(decode)
        const vendor = await Vendor.findById(decode.vendorId)
        // console.log(vendor)
        if(!vendor){
            return res.status(400).send("vendor not found")
        }
        req.vendorId = vendor._id
        next()
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error In Token")
    }
}

module.exports = verifyToken