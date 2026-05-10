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
      "I can't fetch live weather yet, but I hope it's nice where you are!",
      "Weather data isn't available in this demo, but I can still help with frontend questions.",
    ],
  },
  {
    pattern: /(name|who are you|what are you)/i,
    replies: ["I'm a demo React chatbot built to showcase frontend UI and chat interactions."],
  },
  {
    pattern: /(thanks|thank you)/i,
    replies: [
      "You're welcome! Let me know if you want to continue the conversation.",
      "Happy to help! Ask another question when you're ready.",
    ],
  },
  {
    pattern: /(ai|robot|assistant)/i,
    replies: [
      "I'm a simulated AI assistant designed for this React demo. I don't call a real backend yet.",
    ],
  },
];

const fallbackReplies = [
  "That's interesting! Tell me more.",
  'I understand. How can I assist further?',
  'Thanks for sharing! What else would you like to know?',
  "Got it! Is there anything specific you'd like help with?",
  "I'm listening — feel free to ask a different question.",
  'Nice. Do you want to explore React, JavaScript, or UI ideas next?',
];

const randomElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getBotReply = async (messageText) => {
  const normalized = messageText.trim();

  // Try to call the backend API if available (for deployed version)
  try {
    const apiUrl = process.env.REACT_APP_API_URL || '/api/chat';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: normalized }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.reply || 'I could not generate a reply.';
    }
  } catch (error) {
    console.log('API call failed, using local responses:', error.message);
    // Fall back to local implementation
  }

  // Local fallback implementation
  await delay(900 + Math.random() * 900);

  for (const entry of responseMap) {
    if (entry.pattern.test(normalized)) {
      const selected = randomElement(entry.replies);
      return typeof selected === 'function' ? selected() : selected;
    }
  }

  return randomElement(fallbackReplies);
};

export const formatTranscript = (messages) =>
  messages
    .map(
      (message) =>
        `${message.ai ? 'AI' : 'You'} (${new Date(message.createdAt).toLocaleString()}):\n${
          message.text
        }`,
    )
    .join('\n\n');
