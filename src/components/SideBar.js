import React, { useContext, useState } from 'react';
import { ChatContext } from '../context/chatContext';

const SideBar = () => {
  const { isMobile } = useContext(ChatContext);
  const { sidebarOpen, setSidebarOpen } = useContext(ChatContext);
  const { chats, createChat, deleteChat, setCurrentChatId, currentChat, toggleDarkMode, darkMode } =
    useContext(ChatContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className={`
    fixed md:relative z-50 h-screen bg-[#202123] text-white flex flex-col
    transition-all duration-300
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    ${isMobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-16'}
  `}
    >
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mb-4 p-2 hover:bg-gray-700 rounded transition"
      >
        {sidebarOpen ? '⬅' : '➡'}
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="w-full mb-3 p-2 rounded bg-gray-700 hover:bg-gray-600 transition"
      >
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* New Chat Button */}
      <button
        onClick={createChat}
        className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded mb-4 transition-all duration-200"
      >
        {sidebarOpen ? '+ New Chat' : '+'}
      </button>

      {/* Search Input */}
      {sidebarOpen && (
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Chat List */}
      <div className="space-y-2 overflow-y-auto flex-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setCurrentChatId(chat.id);
              setSidebarOpen(false); // ✅ close on mobile
            }}
            className={`p-2 rounded cursor-pointer flex justify-between items-center
transition-all duration-200 hover:bg-[#2a2b32]
${currentChat?.id === chat.id ? 'bg-[#343541]' : ''}`}
          >
            {/* Chat Title */}
            <span onClick={() => setCurrentChatId(chat.id)} className="truncate">
              {sidebarOpen ? chat.title : '💬'}
            </span>

            {/* Delete Button */}
            {sidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ stops parent click
                  deleteChat(chat.id);
                }}
                className="text-red-400 hover:text-red-300"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        {filteredChats.length === 0 && searchTerm && (
          <div className="text-gray-400 text-sm p-2">No chats found</div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
