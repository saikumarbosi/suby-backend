const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const bodyParser = require('body-parser')
const router = require('./routes/vendorRoutes')
const firmRouter = require('./routes/firmRouters')
const productRouter = require('./routes/productRoutes')
const cors = require('cors')
const path = require('path')

dotEnv.config()
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("mongodb connected")
})
.catch((e)=> {
    console.log("ERROR", e)
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/vendor', router)
app.use('/firm', firmRouter)
app.use('/product', productRouter)
app.use('/uploads', express.static('uploads'))

const PORT = 4000

app.listen(PORT, ()=> {
    console.log(`Server running at: ${PORT}`)
})