import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

export const SupportScreen: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '¡Hola! Soy el asistente virtual de ServiClean. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    '¿Cómo cancelo una reserva?',
    '¿Qué incluye la limpieza profunda?',
    'Problemas con un pago'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'Gracias por tu mensaje. Un agente de soporte se pondrá en contacto contigo pronto, o puedes revisar nuestra sección de preguntas frecuentes.' 
      }]);
    }, 1000);
  };

  return (
    <div className="pb-32 pt-20 px-4 md:px-8 max-w-4xl mx-auto h-screen flex flex-col">
      <header className="mb-8 shrink-0">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Soporte</h1>
        <p className="text-lg text-on-surface-variant">Estamos aquí para ayudarte.</p>
      </header>

      <div className="flex-1 bg-surface-lowest rounded-[2rem] shadow-editorial p-4 md:p-8 flex flex-col overflow-hidden mb-4">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-teal-50 text-primary'}`}>
                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-low text-on-surface rounded-tl-none'}`}>
                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {quickQuestions.map((q, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-4 py-2 bg-surface-low text-primary text-sm font-bold rounded-full hover:bg-teal-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Escribe tu mensaje..."
              className="input-minimal flex-1"
            />
            <button 
              onClick={() => handleSend(input)}
              className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-editorial hover:scale-105 transition-transform shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
