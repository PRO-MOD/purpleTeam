const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const io = require('socket.io')(8080,{
    cors: {
        origin: 'http://localhost:5173'
    }
})


connectToMongo();
const app = express()
app.use(cors())
const port = 5000

app.use(express.json())

app.use("/uploads", express.static("uploads"))

//socket io
let users = [];
io.on('connection', socket => {
    console.log('user connceted', socket.id);
    // frontend se backend ko receive karna ho to ye use karenge
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    })
    // backend se frontend ko kuch bhejna ho toh ye use karenge
    // io.emit('getUsers', socket.userId);

    // Handle errors from Socket.IO
io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
});

// Define the 'sendMessage' event handler
socket.on('sendMessage', ({ senderId, recipient, content}) => {
    const receiver = users.find(user => user.userId == recipient);
    const sender = users.find(user => user.userId == senderId);
    try {
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage',{
                sender: senderId,
                content,
                recipient
            })
        } else {
            io.to(sender.socketId).emit('getMessage',{
                sender: senderId,
                content,
                recipient
            })
        }
    } catch (error) {
        console.error('Error handling sendMessage event:', error);
    }
});


    

    socket.on('disconnect', ()=>{
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users)
    })
})

app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/score',require('./routes/score.js'))
app.use('/api/reports',require('./routes/report.js'))
app.use('/api/notes',require('./routes/notes.js'))
app.use('/api/flags',require('./routes/flags.js'))
app.use('/api/chat',require('./routes/chat.js'))

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})