const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  // ✅ simple working response
  let reply = 'I am still learning 🤖';

  if (message.toLowerCase().includes('hello')) {
    reply = 'Hi! How can I help you?';
  } else if (message.toLowerCase().includes('bye')) {
    reply = 'Goodbye 👋';
  }

  res.json({ reply }); // ✅ IMPORTANT: JSON response
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
