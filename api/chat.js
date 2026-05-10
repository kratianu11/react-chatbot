const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const responseMap = [
  {
    pattern: /(hello|hi|hey)/i,
    replies: [
      'Hello! Nice to meet you. What would you like to talk about today?',
      "Hey there! I'm here to help with React, UI design, or JavaScript questions.",
    ],
  },
  {
    pattern: /(bye|goodbye|see you)/i,
    replies: ['Goodbye! Feel free to return anytime you need more help. 👋'],
  },
  {
    pattern: /(help|assist|support)/i,
    replies: [
      "I'm here to assist! Ask me anything about React, frontend UI, or web development.",
      'Need help with a frontend challenge? I can provide examples and guidance.',
    ],
  },
  {
    pattern: /(react|jsx|component|hook)/i,
    replies: [
      'React is a UI library that uses components, state, and props. Want a quick code example?',
      'Using hooks in React makes state simpler. Ask me about useState, useEffect, or custom hooks.',
    ],
  },
  {
    pattern: /(javascript|js|es6)/i,
    replies: [
      'JavaScript powers the web and enables interactive UI. I can explain concepts or give examples.',
      'JS is great for frontend logic. Let me know if you want a sample function or code snippet.',
    ],
  },
  {
    pattern: /(code|example|snippet)/i,
    replies: [
      "Here's a simple React component example:\n\n```jsx\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n```\n\nFeel free to ask for another example.",
    ],
  },
  {
    pattern: /(time|date|clock)/i,
    replies: [() => `The current time is ${new Date().toLocaleString()}.`],
  },
  {
    pattern: /(weather)/i,
    replies: [
      'I cannot fetch real-time weather data. Try visiting weather.com for current conditions.',
    ],
  },
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Find matching reply
  let reply = 'I am still learning 🤖';
  for (const item of responseMap) {
    if (item.pattern.test(message)) {
      const randomReply = item.replies[Math.floor(Math.random() * item.replies.length)];
      reply = typeof randomReply === 'function' ? randomReply() : randomReply;
      break;
    }
  }

  res.status(200).json({ reply });
}
