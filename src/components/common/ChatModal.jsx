import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from './BottomSheet';
import { Send, Phone, ShieldCheck, CheckCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ChatModal({
  isOpen,
  onClose,
  captain,
  onCall,
}) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'captain', text: 'Salam! I am heading towards Banani 11.', time: 'Just now' },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const quickReplies = [
    "I'm at the main gate.",
    "Please bring a spare helmet.",
    "Coming down in 1 minute!",
    "Call me when you reach.",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sounds.playTap();
    const newMsg = {
      id: `msg-${messages.length + 1}`,
      sender: 'user',
      text: text.trim(),
      time: 'Now',
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulated Captain Reply
    setTimeout(() => {
      sounds.playTap();
      const replies = [
        "Received boss! I will be there shortly.",
        "Helmet is ready for you. See you soon!",
        "Okay, parked right outside with hazard lights on.",
        "Understood, take your time!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'captain',
          text: randomReply,
          time: 'Just now',
        }
      ]);
    }, 1200);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={captain ? `Chat with ${captain.name.split(' ')[0]}` : 'Chat with Captain'}
      subtitle={captain ? `${captain.vehicleModel} • ${captain.vehiclePlate}` : 'In-App Secure Messaging'}
      maxHeight="max-h-[80vh]"
    >
      <div className="flex flex-col h-[400px]">
        {/* Safety Header Chip */}
        <div className="py-1 px-3 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] text-slate-500 dark:text-slate-400 mx-auto flex items-center gap-1.5 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Number masked for privacy • Encrypted chat</span>
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-pathao-red text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-red-500" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestions */}
        <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message to captain..."
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pathao-red"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-pathao-red hover:bg-pathao-redDark disabled:opacity-40 text-white flex items-center justify-center transition-transform active:scale-90"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
