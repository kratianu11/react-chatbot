# React Chatbot UI

A modern, responsive chatbot interface built with React, featuring dark mode, markdown support, and interactive chat management.

## Features

- **Interactive Chat Interface**: Send messages and receive AI responses with typing indicators
- **Dark/Light Mode Toggle**: Switch between themes for better user experience
- **Markdown Support**: Render code blocks, links, and formatted text with syntax highlighting
- **Chat Management**: Create, search, and delete chat conversations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Copy Messages**: Easily copy AI responses to clipboard
- **Message Timestamps**: View when messages were sent
- **Search Functionality**: Find chats by title in the sidebar

## Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Moment.js** - Date/time formatting
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kratianu11/react-chatbot.git
   cd react-chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect your GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New..." → "Project"

2. **Import your repository:**
   - Search for `react-chatbot`
   - Select your repository: `kratianu11/react-chatbot`
   - Click "Import"

3. **Deploy:**
   - Vercel will automatically detect it's a React app
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

4. **Your app will be live!**
   - Vercel will provide a `.vercel.app` URL
   - Every push to `main` branch auto-deploys

### Manual Build

```bash
npm run build
```

This creates a `build` folder ready for deployment to any static hosting service.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint for code quality
- `npm run lint:fix` - Fixes linting issues automatically
- `npm run format` - Formats code with Prettier

## Project Structure

```
src/
├── components/
│   ├── ChatMessage.js    # Individual message component
│   ├── ChatView.js       # Main chat interface
│   ├── SideBar.js        # Chat list and navigation
│   └── ...
├── context/
│   └── chatContext.js    # Global state management
├── hooks/
│   └── useMessageCollection.js
└── ...
```

## Deployment

The app is ready for deployment to platforms like Vercel, Netlify, or GitHub Pages:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting platform.

## Demo Responses

This is a frontend-only demo with simulated AI responses. In a production app, you would integrate with a backend API (e.g., OpenAI, custom AI service).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)