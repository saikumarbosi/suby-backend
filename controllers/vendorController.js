const Vendor = require('../models/Vendor')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerVendor = async(req, res) => {
    try {
        const {username, email, password} = req.body 
        const exist = await Vendor.findOne({email})
        if(exist){
            return res.status(400).send("Email alredy exists")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newVendor = new Vendor({username, email, password: hashedPassword})
        await newVendor.save()
        res.status(201).send("Registration Successfully")
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const vendorLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        const exist = await Vendor.findOne({email})
        if(!exist || !(await bcrypt.compare(password, exist.password))){
            return res.status(400).send("Email, Password Not Found")
        }
        const token = jwt.sign({vendorId: exist._id}, "jwtToken", {expiresIn: "1h"})
        res.status(200).json({token})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const getAllVendors = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm')
        res.status(200).json({vendors})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const singleVendor = async(req, res) => {
    try {
       const vendor = await Vendor.findById(req.params.id).populate('firm')
       if(!vendor){
        return res.status(400).send("Vendor Not Found")
       } 
       res.status(200).json({vendor})
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

module.exports = {registerVendor, vendorLogin, getAllVendors, singleVendor}