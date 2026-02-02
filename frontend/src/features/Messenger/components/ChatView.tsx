import React, { useState, useEffect, useRef } from 'react';
import { WinButton } from '@/components/atoms/WinButton/WinButton';
import { IconRenderer } from '@/components/atoms/IconRenderer/IconRenderer';
import { useTranslation } from '@/context/LanguageContext';
import iconNotification from 'pixelarticons/svg/notification.svg';
import type { Contact, Message } from '../types';

interface ChatViewProps {
    activeContact: Contact;
    messages: Message[];
    isTyping: boolean;
    isNudged: boolean;
    onBack: () => void;
    onSend: (text: string) => void;
    onNudge: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
    activeContact,
    messages,
    isTyping,
    isNudged,
    onBack,
    onSend,
    onNudge
}) => {
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100);
    }, []);

    const handleSendClick = () => {
        if (inputText.trim()) {
            onSend(inputText);
            setInputText('');
        }
    };

    return (
        <div className={`messenger-chat ${isNudged ? 'messenger-chat--nudged' : ''}`}>
            {/* Top Info Bar */}
            <header className="messenger-chat__header">
                <div className="messenger-chat__user-row">
                    <div className="messenger-avatar-wrapper">
                        <div className="messenger-avatar-medium" style={{ backgroundColor: activeContact.avatar }}></div>
                    </div>
                    <div className="messenger-chat-user-details">
                        <div className="messenger-chat-username">{activeContact.name}</div>
                        <div className="messenger-chat-email">&lt;{activeContact.name.toLowerCase()}@gmail.com&gt;</div>
                    </div>
                </div>
                <WinButton className="messenger-back-btn" onClick={onBack}>{t('messenger_contacts')}</WinButton>
            </header>

            <div
                className="messenger-chat__log"
                ref={chatLogRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions text"
                aria-label={t('chat_log_label')}
            >
                <div className="messenger-chat__disclaimer">
                    {t('messenger_security_msg')}
                </div>

                {messages.map((msg) => (
                    <article key={msg.id} className="messenger-message-item">
                        <div className={`messenger-message-sender ${msg.sender === 'me' ? 'messenger-sender-me' : 'messenger-sender-them'}`}>
                            {msg.sender === 'me' ? t('messenger_guest') : activeContact.name} {t('messenger_says')}
                        </div>
                        <div className={`messenger-message-text ${msg.text.includes('Nudge') ? 'messenger-message-nudge' : ''}`}>
                            {msg.text}
                        </div>
                    </article>
                ))}

                {isTyping && (
                    <div className="messenger-typing-indicator" role="status">
                        <div className="messenger-typing-text">{activeContact.name} {t('messenger_typing')}</div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Toolbar & Input */}
            <footer className="messenger-toolbar">
                <div className="messenger-toolbar__actions">
                    <button className="messenger-toolbar__btn" title={t('messenger_nudge_action')} onClick={onNudge}>
                        <IconRenderer icon={iconNotification} size={16} className="messenger-icon" />
                    </button>
                    <div className="messenger-toolbar-separator"></div>
                    <button className="messenger-toolbar__btn" aria-label="Text format"><span className="messenger-toolbar-text-btn">A</span></button>
                    <button className="messenger-toolbar__btn" aria-label="Insert emoji"><span className="messenger-toolbar-emoji-btn">😊</span></button>
                </div>

                <div className="messenger-toolbar__input-area">
                    <label htmlFor="chat-input" className="sr-only">{t('messenger_input_label') || "Chat message"}</label>
                    <textarea
                        id="chat-input"
                        ref={textareaRef}
                        className="messenger-textarea"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        maxLength={500}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendClick();
                            }
                        }}
                    />
                    <div className="messenger-send-wrapper">
                        <WinButton className="messenger-send-btn" onClick={handleSendClick}>
                            <span className="messenger-send-text">{t('messenger_send')}</span>
                        </WinButton>
                    </div>
                </div>
            </footer>

            {/* Status Bar */}
            <div className="messenger-status-bar" role="status">
                {isTyping ? `${activeContact.name} ${t('messenger_typing')}` : `${t('messenger_last_msg')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </div>
        </div>
    );
};
