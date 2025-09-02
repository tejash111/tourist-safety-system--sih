const express = require('express')
require('./database/db')
const useroutes = require("./routes/user")
const cookieParser = require("cookie-parser");

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use('/api/user/',useroutes)

app.use('/api',(req,res)=>{
    res.status(200).json({
        message: "hello SIH"
    })
})

app.listen(3000,()=>{
    console.log('App is now running on port 3000');
    
})