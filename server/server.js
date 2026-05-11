const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  let reply = 'I am still learning 🤖';

  if (message.toLowerCase().includes('hello')) {
    reply = 'Hi! How can I help you?';
  } else if (message.toLowerCase().includes('bye')) {
    reply = 'Goodbye 👋';
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
