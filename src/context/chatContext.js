import React, { createContext, useState, useEffect, useReducer, useMemo } from 'react';

export const ChatContext = createContext();

const createNewChat = () => ({
  id: Date.now(),
  title: 'New Chat',
  messages: [],
});

const initialState = () => {
  const savedChats = localStorage.getItem('chatState');
  const darkModeValue = localStorage.getItem('darkMode') === 'true';

  if (savedChats) {
    try {
      const parsed = JSON.parse(savedChats);
      const normalizedId = parsed.currentChatId || parsed.chats?.[0]?.id || null;
      const chats = Array.isArray(parsed.chats) ? parsed.chats : [];
      return {
        sidebarOpen: true,
        darkMode: darkModeValue,
        chats: chats.length > 0 ? chats : [createNewChat()],
        currentChatId: chats.some((chat) => chat.id === normalizedId)
          ? normalizedId
          : chats[0]?.id || null,
      };
    } catch (error) {
      console.error('Failed to parse saved chat state:', error);
    }
  }

  const firstChat = createNewChat();
  return {
    sidebarOpen: true,
    darkMode: darkModeValue,
    chats: [firstChat],
    currentChatId: firstChat.id,
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    case 'SET_CURRENT_CHAT_ID':
      return {
        ...state,
        currentChatId: action.payload,
      };
    case 'CREATE_CHAT': {
      const newChat = createNewChat();
      return {
        ...state,
        chats: [...state.chats, newChat],
        currentChatId: newChat.id,
      };
    }
    case 'DELETE_CHAT': {
      const chats = state.chats.filter((chat) => chat.id !== action.payload);
      const nextChatId =
        state.currentChatId === action.payload ? chats[0]?.id || null : state.currentChatId;
      return {
        ...state,
        chats,
        currentChatId: nextChatId,
      };
    }
    case 'ADD_MESSAGE': {
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== state.currentChatId) return chat;

          const existingIndex = chat.messages.findIndex((msg) => msg.id === action.payload.id);
          const messages = [...chat.messages];

          if (existingIndex !== -1) {
            messages[existingIndex] = action.payload;
          } else {
            messages.push(action.payload);
          }

          const title =
            chat.title === 'New Chat' && action.payload.ai === false
              ? action.payload.text.slice(0, 25)
              : chat.title;

          return {
            ...chat,
            title,
            messages,
          };
        }),
      };
    }
    case 'CLEAR_CHAT': {
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== state.currentChatId) return chat;
          return {
            ...chat,
            title: 'New Chat',
            messages: [],
          };
        }),
      };
    }
    default:
      return state;
  }
};

export const ChatContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [state, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'chatState',
        JSON.stringify({
          chats: state.chats,
          currentChatId: state.currentChatId,
        }),
      );
      localStorage.setItem('darkMode', String(state.darkMode));
    } catch (error) {
      console.error('Failed to save chat state:', error);
    }
  }, [state.chats, state.currentChatId, state.darkMode]);

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });

  const createChat = () => dispatch({ type: 'CREATE_CHAT' });
  const deleteChat = (id) => dispatch({ type: 'DELETE_CHAT', payload: id });
  const setCurrentChatId = (id) => dispatch({ type: 'SET_CURRENT_CHAT_ID', payload: id });
  const setSidebarOpen = (value) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: value });
  const addMessage = (message) => dispatch({ type: 'ADD_MESSAGE', payload: message });
  const clearChat = () => dispatch({ type: 'CLEAR_CHAT' });

  const currentChat = useMemo(
    () => state.chats.find((chat) => chat.id === state.currentChatId) || state.chats[0] || null,
    [state.chats, state.currentChatId],
  );

  return (
    <ChatContext.Provider
      value={{
        chats: state.chats,
        currentChat,
        createChat,
        deleteChat,
        setCurrentChatId,
        addMessage,
        clearChat,
        darkMode: state.darkMode,
        toggleDarkMode,
        sidebarOpen: state.sidebarOpen,
        setSidebarOpen,
        isMobile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
