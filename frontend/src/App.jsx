import React, { useState, useRef, useEffect } from "react";

// Simple icon components (same as before)
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconDatabase = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconCpu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const IconTrending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconSun = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const IconMoon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export default function App() {
  // Load messages from localStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      { from: "bot", text: "Hello! I'm your Data Science assistant. Ask me about algorithms, machine learning, statistics, or any data science concepts." }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const chatEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input.trim() };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("msg", userMsg.text);

      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const botMsg = { from: "bot", text: data.answer };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (err) {
      setError(err.message);
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderMessageContent = (text, index) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <div key={i} className="relative group mt-3">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto border border-slate-800">
              <code className="text-sm font-mono leading-relaxed">{part}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(part, `${index}-${i}`)}
              className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                copiedIndex === `${index}-${i}` 
                  ? "bg-emerald-600 text-white" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Copy code"
            >
              {copiedIndex === `${index}-${i}` ? <IconCheck /> : <IconCopy />}
            </button>
          </div>
        );
      }
      return part ? <div key={i} className="whitespace-pre-wrap leading-relaxed">{part}</div> : null;
    });
  };

  const quickActions = [
    { icon: IconDatabase, label: "Data Analysis", desc: "Explore datasets and statistics" },
    { icon: IconCpu, label: "ML Models", desc: "Machine learning algorithms" },
    { icon: IconTrending, label: "Visualization", desc: "Charts and graphs" },
    { icon: IconMessage, label: "Code Examples", desc: "Programming examples" }
  ];

  const topics = [
    "Linear Regression", "Neural Networks", "Random Forest", "K-Means Clustering",
    "Data Preprocessing", "Feature Engineering", "Cross Validation", "Hyperparameter Tuning"
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      {!isMobile && (
        <div className={`${sidebarOpen ? "w-64 md:w-72 lg:w-80" : "w-16"} ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } border-r transition-all duration-300 flex flex-col`}>
          {/* Header */}
          <div className={`p-4 md:p-6 ${darkMode ? 'border-gray-700' : 'border-slate-200'} border-b`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <IconDatabase />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>DS Assistant</h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Data Science Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <div className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 ${
              darkMode ? 'bg-blue-900/20 border-blue-800 text-blue-400' : ''
            }`}>
              <IconMessage />
              {sidebarOpen && <span className="font-medium">Chat</span>}
            </div>
          </div>

          {/* Dark Mode Toggle & Sidebar Toggle */}
          <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-slate-200'} border-t`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <IconSun /> : <IconMoon />}
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with mobile menu button */}
        <header className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
        } border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between`}>
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`mr-3 p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <IconMenu />
              </button>
            )}
            <div>
              <h2 className={`text-lg md:text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Chat</h2>
              <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Ask questions about data science</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          )}
        </header>

        {/* Chat Content */}
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {messages.length === 1 && (
                <div className="text-center py-8 md:py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 md:mb-6">
                    <IconMessage />
                  </div>
                  <h3 className={`text-lg md:text-xl font-semibold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  } mb-2`}>Ready to help with Data Science!</h3>
                  <p className={`${
                    darkMode ? 'text-gray-400' : 'text-slate-500'
                  } mb-6 md:mb-8 text-sm md:text-base`}>Ask me about algorithms, code examples, or concepts</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto mb-6 md:mb-8">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(`Tell me about ${action.label.toLowerCase()}`)}
                        className={`p-3 md:p-4 rounded-xl hover:shadow-md transition-all duration-200 text-left border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-600 hover:bg-gray-750' 
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-blue-500 mb-1 md:mb-2">
                          <action.icon />
                        </div>
                        <div className={`font-medium text-sm md:text-base ${
                          darkMode ? 'text-white' : 'text-slate-800'
                        }`}>{action.label}</div>
                        <div className={`text-xs md:text-sm ${
                          darkMode ? 'text-gray-400' : 'text-slate-500'
                        }`}>{action.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {topics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(`Explain ${topic}`)}
                        className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-full md:max-w-4xl rounded-2xl px-4 py-3 md:px-6 md:py-4 ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : darkMode
                        ? "bg-gray-800 border border-gray-700 text-gray-100 shadow-sm"
                        : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                  }`}>
                    {msg.from === "bot" && (
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mr-2"></div>
                        <span className={`text-xs md:text-sm font-medium ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>DS Assistant</span>
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                      {renderMessageContent(msg.text, i)}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className={`rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className={`text-xs md:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className={`border-t p-4 md:p-6 ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-slate-200 bg-white'
            }`}>
              <div className="flex space-x-3 md:space-x-4 items-end">
                <div className="flex-1">
                  <textarea
                    rows={2}
                    placeholder="Ask me about data science, machine learning, statistics..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full border rounded-xl px-4 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                    }`}
                    disabled={loading}
                  />
                  {error && (
                    <div className="mt-1 md:mt-2 text-red-500 text-xs md:text-sm">{error}</div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    loading || !input.trim()
                      ? darkMode 
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <IconSend />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}