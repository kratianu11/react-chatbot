# React Chatbot UI

A responsive React chatbot interface with saved conversations, theme switching, markdown rendering, and demo bot replies. The app can call an API route when one is available and falls back to local simulated responses for a smooth frontend demo.

## Features

- **Chat interface**: Send messages, view bot replies, and see a typing state while a response is generated.
- **Conversation management**: Create, search, select, clear, delete, copy, and export chats.
- **Persistent state**: Saves conversations and theme preference in `localStorage`.
- **Dark and light themes**: Toggle between modes from the sidebar.
- **Markdown support**: Renders formatted messages, links, tables, and code blocks with syntax highlighting.
- **Responsive layout**: Works across desktop and mobile screen sizes.
- **API fallback**: Uses `/api/chat` or `REACT_APP_API_URL` when available, then falls back to local demo responses.

## Tech Stack

- React 18
- Tailwind CSS and DaisyUI
- React Markdown with GitHub-flavored markdown
- React Syntax Highlighter
- Moment.js
- React Context API
- Optional Express backend and Vercel serverless API route

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/kratianu11/react-chatbot.git
cd react-chatbot
npm install
```

### Run the Frontend

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Backend

The React app works without a backend because it includes local fallback responses. To run the included Express demo API:

```bash
cd server
npm install
npm start
```

The backend starts on `http://localhost:5000` by default. To point the frontend at it, create a `.env` file in the project root:

```bash
REACT_APP_API_URL=http://localhost:5000/chat
```

Restart `npm start` after changing environment variables.

## Available Scripts

- `npm start` - Runs the React app in development mode.
- `npm run build` - Builds the app for production into the `build` folder.
- `npm test` - Launches the test runner.
- `npm run lint` - Runs ESLint for source files.
- `npm run lint:fix` - Applies automatic ESLint fixes.
- `npm run format` - Formats source files with Prettier.

## Project Structure

```text
api/
└── chat.js                  # Vercel serverless demo API route
server/
└── server.js                # Optional Express demo API
src/
├── components/
│   ├── ChatMessage.js       # Individual message component
│   ├── ChatView.js          # Main chat interface
│   ├── SideBar.js           # Chat list and navigation
│   └── ...
├── context/
│   └── chatContext.js       # Global chat and theme state
├── hooks/
│   └── useMessageCollection.js
├── services/
│   └── chatService.js       # API call and local demo responses
└── App.js
```

## Deployment

### Vercel

This repository includes `vercel.json` and an `api/chat.js` serverless route.

1. Import `kratianu11/react-chatbot` into Vercel.
2. Keep the build command as `npm run build`.
3. Keep the output directory as `build`.
4. Deploy the project.

Every push to the connected branch can trigger a new deployment.

### Static Hosting

For Netlify, GitHub Pages, or any static host:

```bash
npm run build
```

Deploy the generated `build` folder. The app will still work with local demo responses unless you configure `REACT_APP_API_URL` for a deployed backend.

### Render Backend

`render.yaml` can deploy the optional Express backend from the `server` folder. After deployment, set `REACT_APP_API_URL` in the frontend deployment to the backend `/chat` endpoint.

## Notes

This project currently uses simulated chatbot responses. It does not call OpenAI or any other paid AI provider by default.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.
