import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import 'react-tooltip/dist/react-tooltip.css';

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const { setSidebarOpen, currentChat, addMessage, darkMode } = useContext(ChatContext);
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentNode;

    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageText = input;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      createdAt: Date.now(),
      ai: false,
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);

    const botMessageId = Date.now() + 1;

    // empty bot message
    addMessage({
      id: botMessageId,
      text: '',
      createdAt: Date.now(),
      ai: true,
    });

    try {
      // ✅ DEMO RESPONSE (no backend)
      const data = {
        reply: 'Hi! I’m your demo AI 🤖. Backend is not connected yet.',
      };

      addMessage({
        id: botMessageId,
        text: data.reply,
        createdAt: Date.now(),
        ai: true,
      });
    } catch (error) {
      addMessage({
        id: botMessageId,
        text: 'Something went wrong ❌',
        ai: true,
        status: 'error',
      });
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 👇 Get input value
      sendMessage(e);
      inputRef.current.style.height = 'auto';
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);
  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const retryMessage = async (message) => {
    if (!message?.text) return;

    setIsTyping(true);

    const botMessageId = message.id;

    try {
      // ✅ demo retry
      const reply = 'Retry successful ✅ (Demo response)';

      addMessage({
        id: botMessageId,
        text: reply,
        ai: true,
      });
    } catch (error) {
      addMessage({
        id: botMessageId,
        text: 'Retry failed ❌',
        ai: true,
        status: 'error',
      });
    }

    setIsTyping(false);
  };
  return (
    <div
      className={`flex flex-col h-screen ${darkMode ? 'bg-[#343541] text-white' : 'bg-gray-50'}`}
    >
      {/* RIGHT SIDE CHAT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <div
          className={`h-14 border-b flex items-center px-4 font-medium gap-3 
${darkMode ? 'bg-[#40414f]' : 'bg-white'}`}
        >
          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-xl">
            ☰
          </button>
          Chat Assistant
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* EMPTY STATE */}
            {currentChat?.messages.length === 0 && (
              <div className="text-center mt-32 text-gray-400">
                <h1 className="text-3xl mb-2">How can I help you?</h1>
                <p>Start a conversation 🚀</p>
              </div>
            )}

            {/* MESSAGES */}
            {currentChat?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} retryMessage={retryMessage} />
            ))}

            {/* TYPING */}
            {isTyping && (
              <div className="flex gap-1 text-gray-400">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-100">●</span>
                <span className="animate-pulse delay-200">●</span>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className={`border-t ${darkMode ? 'bg-[#40414f]' : 'bg-white'} py-3`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 w-full max-w-3xl mx-auto px-2 md:px-0"
          >
            <textarea
              ref={inputRef}
              className={`flex-1 w-full resize-none p-3 md:p-4 rounded-xl text-sm
${
  darkMode
    ? 'bg-[#40414f] text-white border border-gray-600 placeholder-gray-400'
    : 'bg-white text-black border border-gray-300 placeholder-gray-500'
}`}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />

            <button
              type="submit"
              disabled={isTyping}
              className={`px-6 py-2 rounded-xl transition ${
                isTyping
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
