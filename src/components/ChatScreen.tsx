import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { dbColaboradores } from '../data';
import { Avatar } from './Avatar';

interface ChatScreenProps {
  workerId: number;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'worker';
  time: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ workerId, onBack }) => {
  const worker = dbColaboradores.find(w => w.id === workerId);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `¡Hola! Soy ${worker?.nombre}. ¿En qué te puedo ayudar hoy?`,
      sender: 'worker',
      time: '10:00 AM'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!worker) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate worker response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entiendo, estaré encantado de ayudarte con eso. ¿Tienes alguna otra duda antes de agendar?',
        sender: 'worker',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-surface-low">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-surface-low flex items-center justify-center text-on-surface hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src={worker.avatarUrl} name={worker.nombre} className="w-10 h-10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-on-surface leading-tight">{worker.nombre}</h2>
              <p className="text-xs text-slate-400 font-medium">En línea</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-surface-low transition-colors">
            <Phone size={20} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-surface-low transition-colors">
            <Video size={20} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-surface-low transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">Hoy</span>
        </div>
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <Avatar src={worker.avatarUrl} name={worker.nombre} className="w-8 h-8 rounded-full mr-2 mt-auto" />
              )}
              <div className={`max-w-[75%] ${isUser ? 'order-1' : 'order-2'}`}>
                <div 
                  className={`px-5 py-3 rounded-2xl ${
                    isUser 
                      ? 'bg-primary text-white rounded-br-sm' 
                      : 'bg-white text-on-surface border border-slate-100 shadow-sm rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <p className={`text-[10px] text-slate-400 mt-1 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-surface-low rounded-3xl border border-slate-200 overflow-hidden flex items-center px-4 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 text-sm text-on-surface"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
              inputText.trim() 
                ? 'bg-primary text-white shadow-editorial hover:scale-105 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} className={inputText.trim() ? 'ml-1' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
};
