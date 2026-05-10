import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import { getBotReply, formatTranscript } from '../services/chatService';

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const { setSidebarOpen, currentChat, addMessage, clearChat, darkMode } = useContext(ChatContext);
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [chatActionLabel, setChatActionLabel] = useState('');
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
    if (!input.trim() || !currentChat) return;

    const messageText = input.trim();
    const userMessage = {
      id: Date.now(),
      text: messageText,
      createdAt: Date.now(),
      ai: false,
    };

    addMessage(userMessage);
    setInput('');
    setIsTyping(true);
    setChatActionLabel('');

    const botMessageId = Date.now() + 1;

    addMessage({
      id: botMessageId,
      text: '',
      createdAt: Date.now(),
      ai: true,
      status: 'loading',
    });

    try {
      const reply = await getBotReply(messageText);
      addMessage({
        id: botMessageId,
        text: reply,
        createdAt: Date.now(),
        ai: true,
      });
    } catch (error) {
      addMessage({
        id: botMessageId,
        text: 'Something went wrong ❌. Please try again.',
        ai: true,
        status: 'error',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
    inputRef.current?.focus();
  }, [currentChat?.id]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const retryMessage = async (message) => {
    if (!message || !currentChat) return;

    setIsTyping(true);
    setChatActionLabel('');

    const botMessageId = message.id;
    addMessage({
      ...message,
      text: '',
      status: 'loading',
    });

    try {
      const reply = await getBotReply(message.text || 'Please retry.');
      addMessage({
        id: botMessageId,
        text: reply,
        createdAt: Date.now(),
        ai: true,
      });
    } catch (error) {
      addMessage({
        id: botMessageId,
        text: 'Retry failed ❌',
        ai: true,
        status: 'error',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const clearCurrentChat = () => {
    if (!currentChat?.messages?.length) return;
    clearChat();
    setInput('');
    setChatActionLabel('Chat cleared');
  };

  const copyConversation = async () => {
    if (!currentChat?.messages?.length) return;
    try {
      await navigator.clipboard.writeText(formatTranscript(currentChat.messages));
      setChatActionLabel('Copied conversation');
    } catch (error) {
      setChatActionLabel('Copy failed');
    }
  };

  const downloadConversation = () => {
    if (!currentChat?.messages?.length) return;
    const blob = new Blob([formatTranscript(currentChat.messages)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${currentChat.title.replace(/\s+/g, '_') || 'chat'}_${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setChatActionLabel('Download ready');
  };

  useEffect(() => {
    if (!chatActionLabel) return undefined;
    const timeout = window.setTimeout(() => setChatActionLabel(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [chatActionLabel]);

  const messageCount = currentChat?.messages.length ?? 0;

  return (
    <div
      className={`flex flex-col h-screen ${darkMode ? 'bg-[#343541] text-white' : 'bg-gray-50'}`}
    >
      {/* RIGHT SIDE CHAT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <div
          className={`h-20 border-b flex flex-col justify-center px-4 font-medium gap-3 transition-colors duration-200
${darkMode ? 'bg-[#40414f] text-white' : 'bg-white text-slate-900'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-xl">
                ☰
              </button>
              <div>
                <div className="text-base font-semibold">
                  {currentChat?.title || 'Chat Assistant'}
                </div>
                <div className="text-xs text-gray-400">{messageCount} messages</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button
                onClick={clearCurrentChat}
                disabled={!messageCount}
                className="rounded-full border px-3 py-1 transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear current chat"
              >
                Clear
              </button>
              <button
                onClick={copyConversation}
                disabled={!messageCount}
                className="rounded-full border px-3 py-1 transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Copy conversation"
              >
                Copy
              </button>
              <button
                onClick={downloadConversation}
                disabled={!messageCount}
                className="rounded-full border px-3 py-1 transition hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Download conversation"
              >
                Export
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Frontend demo • responsive • polished UI</span>
            {chatActionLabel && <span className="text-green-300">{chatActionLabel}</span>}
          </div>
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
              <div className="flex gap-1 text-gray-400 items-center">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
                <span className="ml-2 text-sm">AI is typing...</span>
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
