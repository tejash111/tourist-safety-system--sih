const express = require('express')
require('./database/db')
const useroutes = require("./routes/user")
const cookieParser = require("cookie-parser");
const http=require('http')

const socketio=require('socket.io')

const server=http.createServer()

const io=socketio(server)

const app = express()

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use('/api/user/',useroutes)

//socket
io.on("connection",function (socket){
    socket.on("send-location",function(data){
       io.emit("receive-location",{id : socket.id,...data}) 
       
    })
    
    socket.on("disconnect",function(){
        io.emit('user-disconnected',socket.id);
    })
})

app.use('/api',(req,res)=>{
    res.status(200).json({
        message: "hello SIH"
    })
})

server.listen(3000,()=>{
    console.log('App is now running on port 3000');
    
})