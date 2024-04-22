const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const io = require('socket.io')(8080,{
    cors: {
        origin: 'http://localhost:5173'
    }
})
const { router: chatRouter, handleSocket } = require('./routes/chat');


connectToMongo();
const app = express()
app.use(cors())
const port = 5000

app.use(express.json())

app.use("/uploads", express.static("uploads"))

// Call the handleSocket function with the io instance
handleSocket(io);

app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/score',require('./routes/score.js'))
app.use('/api/reports',require('./routes/report.js'))
app.use('/api/notes',require('./routes/notes.js'))
app.use('/api/flags',require('./routes/flags.js'))
app.use('/api/chat',chatRouter)

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})