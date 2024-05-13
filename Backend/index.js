const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const crypto = require('crypto');
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

app.use('/api/reports/SITREP',require('./routes/report.js'))
app.use('/api/reports/Notification',require('./routes/notification.js'))
app.use('/api/reports/IRREP',require('./routes/IncidentReport.js'))

app.use('/api/reports',require('./routes/report.js')) // get report sit

app.use('/api/notes',require('./routes/notes.js'))
app.use('/api/flags',require('./routes/flags.js'))
app.use('/api/chat',chatRouter)

// Define webhook endpoint
app.post('/api/webhook', (req, res) => {
    // Extract payload from request body
    const payload = req.body;
  
    // Process the webhook payload
    // Implement your logic here to handle the incoming data
    console.log('Received webhook payload:', payload);
  
    // Send a response back to the webhook sender (optional)
    res.status(200).send('Webhook received successfully');
  });

  const sharedSecret = "d7f013280cddd3b074790a77606240d5ad1517c9059bcf6810d82d230e8db973"
  // Define webhook validation endpoint
// Endpoint for validating webhook ownership
app.get('/', (req, res) => {
    // const sharedSecret = process.env.SHARED_SECRET;
    const token = req.query.token;
    console.log("hello");
    if (!sharedSecret || !token) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
  
    const hmac = crypto.createHmac('sha256', sharedSecret);
    const hash = hmac.update(token).digest('hex');
  
    return res.json({ response: hash });
  });

  // Endpoint for handling webhook events
app.post('/', (req, res) => {
    console.log('Request URL:', req.url);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    
    return res.status(200).end();
  });

  app.get("/hello",(req, res) => {
    res.send("hello")
  })

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})