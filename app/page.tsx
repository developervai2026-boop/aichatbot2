// app/page.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ClaudeAIChat() {
  const [model, setModel] = useState('claude-3-5-sonnet-20240620');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-2xl font-bold">Claude AI</h1>
            <p className="text-sm text-gray-400">Powered by Anthropic</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (সেরা)</option>
            <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            <option value="claude-3-haiku-20240307">Claude 3 Haiku (দ্রুত)</option>
          </select>

          <button
            onClick={clearChat}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2"
          >
            🗑️ Clear Chat
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-6">👋</div>
            <h2 className="text-3xl font-semibold mb-3">হ্যালো! আমি Claude</h2>
            <p className="text-gray-400 max-w-md">
              যেকোনো প্রশ্ন করো, কোড লিখতে বলো, বা যেকোনো বিষয়ে আলোচনা করো।
              আমি বাংলা ও ইংরেজি দুটোতেই উত্তর দিতে পারি।
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-6 py-4 rounded-3xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 rounded-br-none'
                    : 'bg-gray-800 rounded-bl-none'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-[17px] leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-6 py-4 rounded-3xl rounded-bl-none flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></div>
              <span className="ml-2 text-gray-400">Claude চিন্তা করছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="এখানে তোমার প্রশ্ন লিখো..."
              className="flex-1 bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-2xl px-6 py-4 text-lg outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 px-10 rounded-2xl font-medium text-lg transition-all"
            >
              পাঠাও
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            Claude দিয়ে AI Chat • Vercel + Next.js
          </p>
        </form>
      </div>
    </div>
  );
}
