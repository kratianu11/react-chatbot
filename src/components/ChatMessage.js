import React, { lazy, Suspense, useState } from 'react';

const ReactMarkdown = lazy(() => import('react-markdown'));
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, retryMessage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {message.status === 'loading' && <div className="text-gray-400 text-xs mt-1">Typing...</div>}

      {message.status === 'error' && (
        <>
          <div className="text-red-400 text-xs mt-1">Failed to respond</div>
          <button
            className="text-xs text-blue-400 mt-1 hover:underline"
            onClick={() => retryMessage(message)}
          >
            Retry
          </button>
        </>
      )}

      {message.status === 'error' && (
        <div className="text-red-400 text-xs mt-1">Failed to respond</div>
      )}

      <div className={`w-full ${message.ai ? 'bg-[#444654]' : 'bg-[#343541]'}`}>
        <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4 relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>

          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm">
            {message.ai ? '🤖' : '🧑'}
          </div>

          <div className="text-sm leading-relaxed text-white">
            <Suspense fallback={<div className="text-gray-400">...</div>}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter style={oneDark} language={match[1]}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-700 px-1 py-0.5 rounded">{children}</code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
