import { ChatContext } from './context/chatContext';
import React, { useContext, Suspense, lazy } from 'react';

const ChatView = lazy(() => import('./components/ChatView'));
const SideBar = lazy(() => import('./components/SideBar'));

const App = () => {
  const { darkMode } = useContext(ChatContext);
  <div className={`flex h-screen ${darkMode ? 'bg-[#343541]' : 'bg-gray-50'}`}></div>;
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div className="flex h-screen bg-[#343541] text-white">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white">
          <SideBar />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatView />
        </div>
      </div>
    </Suspense>
  );
};

export default App;
