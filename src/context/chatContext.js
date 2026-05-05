import React, { createContext, useState, useEffect } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  // ✅ LOAD from localStorage (BEST WAY)
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('chats');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  });

  const [currentChatId, setCurrentChatId] = useState(() => {
    try {
      const saved = localStorage.getItem('chats');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed[0]?.id || null;
    } catch {
      return null;
    }
  });

  // ✅ SAVE to localStorage (ONLY ONE)
  useEffect(() => {
    console.log('Saving chats:', chats);
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // ✅ Create new chat
  const createChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  // ✅ Add message
  const addMessage = (newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === currentChatId) {
          let updatedMessages = [...chat.messages];

          const existingIndex = updatedMessages.findIndex((msg) => msg.id === newMessage.id);

          if (existingIndex !== -1) {
            // ✅ update streaming message
            updatedMessages[existingIndex] = newMessage;
          } else {
            updatedMessages.push(newMessage);
          }

          // ✅ AUTO TITLE LOGIC (IMPORTANT)
          let newTitle = chat.title;

          if (chat.title === 'New Chat' && newMessage.ai === false) {
            newTitle = newMessage.text.slice(0, 25); // first 25 chars
          }

          return {
            ...chat,
            messages: updatedMessages,
            title: newTitle,
          };
        }

        return chat;
      }),
    );
  };
  // ✅ Delete chat
  const deleteChat = (id) => {
    const updated = chats.filter((chat) => chat.id !== id);
    setChats(updated);

    if (id === currentChatId) {
      setCurrentChatId(updated[0]?.id || null);
    }
  };

  const currentChat = chats.find((c) => c.id === currentChatId);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        createChat,
        deleteChat,
        setCurrentChatId,
        addMessage,
        darkMode,
        toggleDarkMode,
        sidebarOpen,
        setSidebarOpen,
        isMobile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
