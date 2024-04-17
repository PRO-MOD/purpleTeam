const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')


connectToMongo();
const app = express()
app.use(cors())
const port = 5000

app.use(express.json())

app.use("/uploads", express.static("uploads"))

app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/score',require('./routes/score.js'))
app.use('/api/reports',require('./routes/report.js'))
app.use('/api/notes',require('./routes/notes.js'))

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})