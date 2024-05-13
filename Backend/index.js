const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')
const crypto = require('crypto');
const Score = require('./models/score.js')
const io = require('socket.io')(8080,{
    cors: {
        origin: 'http://localhost'
    }
})
const { router: chatRouter, handleSocket, users } = require('./routes/chat');


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

  // const sharedSecret = process.env.CTFD_WEBHOOK_SHARED_SECRECT;
  const sharedSecret = "d7f013280cddd3b074790a77606240d5ad1517c9059bcf6810d82d230e8db973";
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
app.post('/', async (req, res) => {
  const { challenge_id, date, id } = req.body;
  console.log("Requested Body: >> "+ challenge_id, date, id );
  // Fetch all documents from Score schema
  const scores = await Score.find();

  // Iterate over each document
  for (const score of scores) {
    // Fetch data from CTFd API for each account_id
    const response = await fetch(`https://ctf.hacktify.in/api/v1/users/${score.account_id}/solves`);
    const { success, data } = await response.json();

    if (success) {
      // Check if there's a match with the provided challenge_id and date
      const match = data.find(item => item.challenge_id === challenge_id && item.id === id && item.date === date);

      if (match) {
        console.log(`User ${score.name} solved challenge ${match.challenge.name}`);
        // Emit event to the user socket
        const user = users.find(user => user.userId === score.user);
        if (user) {
          io.to(user.socketId).emit('challengeSolved', { challenge: match.challenge.name });
          console.log("Emmited ChallengeSolved to frontend");
        } else {
          console.error(`User ${score.name} is not connected to the server`);
        }
      }
    } else {
      console.error('Error fetching data from CTFd API:', data);
    }
  }

    
    return res.status(200).end();
  });

  app.get("/hello",(req, res) => {
    res.send("hello")
  })

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})