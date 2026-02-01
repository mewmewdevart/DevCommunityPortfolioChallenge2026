import React, { useState } from 'react';
import { useTranslation } from '@context/LanguageContext';
import './Messenger.css';

import type { Contact, Message, ViewState } from './types';
import { MOCK_RESPONSES } from './data/mockData';
import { LoginView } from './components/LoginView';
import { ContactsView } from './components/ContactsView';
import { ChatView } from './components/ChatView';

export const Messenger = () => {
  const [view, setView] = useState<ViewState>('login');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isNudged, setIsNudged] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { t } = useTranslation();

  const handleLogin = () => setView('contacts');

  const openChat = (contact: Contact) => {
    setActiveContact(contact);
    setView('chat');
    if (!messages[contact.id]) {
      setMessages(prev => ({ ...prev, [contact.id]: [] }));
    }
  };

  const generateAIResponse = async (history: Message[], contactId: string) => {
    setIsTyping(true);
    const delay = Math.floor(Math.random() * 1500) + 1500;

    setTimeout(() => {
      const randomText = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      const reply: Message = {
        id: Date.now().toString(),
        sender: 'them',
        text: randomText,
        timestamp: new Date()
      };

      setMessages(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), reply]
      }));
      setIsTyping(false);
    }, delay);
  };

  const handleSend = (text: string) => {
    if (!text.trim() || !activeContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: text,
      timestamp: new Date()
    };

    const updatedMessages = [...(messages[activeContact.id] || []), newMessage];

    setMessages(prev => ({
      ...prev,
      [activeContact.id]: updatedMessages
    }));

    generateAIResponse(updatedMessages, activeContact.id);
  };

  const handleNudge = () => {
    setIsNudged(true);
    if (activeContact) {
      const nudgeMsg: Message = {
        id: Date.now().toString(),
        sender: 'me',
        text: t('messenger_nudge'),
        timestamp: new Date()
      };
      const updatedMessages = [...(messages[activeContact.id] || []), nudgeMsg];

      setMessages(prev => ({ ...prev, [activeContact.id]: updatedMessages }));

      setTimeout(() => {
        setIsTyping(false);
        generateAIResponse(updatedMessages, activeContact.id);
      }, 500);
    }
    setTimeout(() => setIsNudged(false), 500);
  };

  return (
    <main className="messenger">
      <div className="messenger-content">
        {view === 'login' && <LoginView onLogin={handleLogin} />}
        {view === 'contacts' && <ContactsView onOpenChat={openChat} />}
        {view === 'chat' && activeContact && (
          <ChatView
            activeContact={activeContact}
            messages={messages[activeContact.id] || []}
            isTyping={isTyping}
            isNudged={isNudged}
            onBack={() => setView('contacts')}
            onSend={handleSend}
            onNudge={handleNudge}
          />
        )}
      </div>
    </main>
  );
};