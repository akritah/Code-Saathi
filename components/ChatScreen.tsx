   'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  image: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
}

interface ChatScreenProps {
  profile: Profile;
  onBack: () => void;
}

export default function ChatScreen({ profile, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: profile.id,
      text: "Hey! Saw your profile and loved your skills! Want to team up for the upcoming hackathon? 🚀",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      senderId: 0, // Current user
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response
    setTimeout(() => {
      const responses = [
        "That sounds great! What's your experience with React?",
        "I'd love to work together! When does the hackathon start?",
        "Perfect! I think our skills complement each other well.",
        "Awesome! Let's brainstorm some project ideas.",
        "I'm excited to collaborate! What type of projects interest you?"
      ];
      
      const response: Message = {
        id: messages.length + 2,
        senderId: profile.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700 bg-slate-800/50 backdrop-blur">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="text-gray-400 hover:text-white mr-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <img
          src={profile.image}
          alt={profile.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        
        <div>
          <h2 className="font-semibold text-white">{profile.name}</h2>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === 0
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'glass-effect text-white border border-gray-600'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === 0 ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-slate-800/50 backdrop-blur">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 border-gray-600 text-white placeholder-gray-400"
          />
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}