import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getChatHistory, saveChatMessage } from '../../firebase/chatbot';
import { INITIAl_MESSAGE, findBestMatch, getRandomSuggestions } from '../../data/chatbotKnowledge';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

const FogAssistant = () => {
    const authContext = useAuth();
    // Handling case where user might be null if not logged in
    const user = authContext ? authContext.user : null;

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);

    // Load initial chat history and suggestions
    useEffect(() => {
        setSuggestions(getRandomSuggestions());

        const loadHistory = async () => {
            if (user && user.uid) {
                const history = await getChatHistory(user.uid);
                if (history && history.length > 0) {
                    setMessages(history);
                } else {
                    setMessages([INITIAl_MESSAGE]);
                }
            } else {
                setMessages([INITIAl_MESSAGE]);
            }
        };

        loadHistory();
    }, [user]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSend = async (textOverride = null) => {
        const textToUse = textOverride || inputValue;
        if (!textToUse.trim()) return;

        // Add user message
        const userMsg = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            text: textToUse.trim(),
            sender: 'user',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Save user message to Firebase
        if (user && user.uid) {
            await saveChatMessage(user.uid, userMsg);
        }

        // Generate bot response with a slight fake delay (800ms)
        setTimeout(async () => {
            const botResponseText = findBestMatch(textToUse.trim());
            const botMsg = {
                id: (Date.now() + 1).toString() + Math.random().toString(36).substr(2, 5),
                text: botResponseText,
                sender: 'bot',
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
            setSuggestions(getRandomSuggestions());

            if (user && user.uid) {
                await saveChatMessage(user.uid, botMsg);
            }
        }, 800);
    };

    return (
        <div className="flex flex-col h-full w-full bg-black/20 rounded-xl overflow-hidden shadow-inner shadow-black/50">
            {/* Header */}
            <div className="flex items-center gap-2 p-3 md:p-3 border-b border-white/5 shrink-0 bg-obsidian-light/50 backdrop-blur-sm z-10">
                <div className="w-8 h-8 rounded-full bg-dbd-red/20 flex items-center justify-center border border-dbd-red/30 shrink-0 overflow-hidden relative shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-dbd-red to-dbd-red/30 opacity-20"></div>
                    <span className="text-lg">👥</span>
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase italic tracking-tighter text-white flex items-center gap-1">
                        THE Entity <SparklesIcon className="w-3 h-3 text-dbd-red" />
                    </h3>
                    <p className="text-[9px] text-smoke">How can we help?</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                {messages.map((msg, i) => (
                    <div key={msg.id || i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scaleUp`}>
                        <div
                            className={`max-w-[90%] p-3 text-xs shadow-lg ${msg.sender === 'user'
                                ? 'bg-gradient-to-br from-dbd-red to-red-600 text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white/10 text-white rounded-2xl rounded-tl-sm border border-white/10'
                                }`}
                        >
                            <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                            <span className={`text-[8px] mt-1 block tracking-wider ${msg.sender === 'user' ? 'text-red-200/70 text-right' : 'text-smoke opacity-60'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 border border-white/10 flex gap-1 items-center h-9">
                            <span className="w-1.5 h-1.5 bg-smoke rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-smoke rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-smoke rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Suggestion Chips */}
            <div className="px-3 pb-2 pt-1 shrink-0 flex gap-2 overflow-x-auto custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                    .hide-scroll-bar::-webkit-scrollbar { display: none; }
                `}</style>
                <div className="flex gap-2 hide-scroll-bar">
                    {suggestions.map((sugg, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(sugg)}
                            className="shrink-0 text-[9px] font-bold text-dbd-red bg-dbd-red/10 border border-dbd-red/20 rounded-full px-3 py-1.5 hover:bg-dbd-red/20 hover:border-dbd-red/40 transition-colors whitespace-nowrap shadow-sm"
                        >
                            {sugg}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-2 md:p-3 border-t border-white/5 shrink-0 bg-obsidian-light/30">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2 relative"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-xs text-white placeholder-smoke/60 focus:outline-none focus:border-dbd-red/50 focus:bg-white/5 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="absolute right-1 w-8 h-8 rounded-full bg-gradient-to-br from-dbd-red to-red-600 text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:grayscale transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FogAssistant;
