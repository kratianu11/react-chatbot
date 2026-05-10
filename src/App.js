import React, { useContext, Suspense, lazy } from 'react';
import { ChatContext } from './context/chatContext';

const ChatView = lazy(() => import('./components/ChatView'));
const SideBar = lazy(() => import('./components/SideBar'));

const App = () => {
  const { darkMode } = useContext(ChatContext);

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div
        className={`flex h-screen ${
          darkMode ? 'bg-[#1a1c24] text-white' : 'bg-gray-100 text-slate-900'
        }`}
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-800 bg-[#202123] md:w-72">
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
