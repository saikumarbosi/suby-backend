const Firm = require('../models/Firm')
const Vendor = require('../models/Vendor')

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

const addFirm = async (req, res) => {
    try {
        const { firmname, area, category, region, offer } = req.body
        const image = req.file ? req.file.filename : undefined

        const vendor = await Vendor.findById(req.vendorId)
        if(!vendor){
            return res.status(400).send("vendor not found")
        }
        const firm = new Firm({firmname, area, category, region, offer,image, vendor: vendor._id})
        const saveFirm = await firm.save()
        vendor.firm.push(saveFirm)
        await vendor.save()
        res.status(200).send("firm added successfully")
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

const deleteFirmById = async(req, res) => {
    try {
        const deleteFirm = await Firm.findByIdAndDelete(req.params.id)
        if(!deleteFirm){
            return res.status(400).send("Firm not delete")
        }
        res.status(200).send("Deleted Successfully")
    } 
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error")
    }
}

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById }