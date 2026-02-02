import React from 'react';
import { IconRenderer } from '@/components/atoms/IconRenderer/IconRenderer';
import { useTranslation } from '@/context/LanguageContext';
import iconUser from 'pixelarticons/svg/user.svg';
import iconChevronDown from 'pixelarticons/svg/chevron-down.svg';
import type { Contact } from '../types';
import { MOCK_CONTACTS } from '../data/mockData';

interface ContactsViewProps {
    onOpenChat: (c: Contact) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ onOpenChat }) => {
    const { t } = useTranslation();
    return (
        <div className="messenger-contacts">

            <header className="messenger-user-status">
                <div className="messenger-avatar-box">
                    <IconRenderer icon={iconUser} size={32} className="messenger-user-icon" />
                </div>
                <div className="messenger-user-info">
                    <span className="messenger-user-name">{t('messenger_guest')}</span>
                    <div className="messenger-status-dropdown">
                        <span className="messenger-status-dot-icon">●</span>
                        <span>{t('messenger_online')}</span>
                        <IconRenderer icon={iconChevronDown} size={16} />
                    </div>
                </div>
            </header>


            <section className="messenger-contact-list" aria-label={t('contact_list') || "Contact list"}>
                <div className="messenger-group-header">
                    <IconRenderer icon={iconChevronDown} size={16} className="messenger-group-chevron" />
                    <span className="messenger-group-title">{t('messenger_friends')} ({MOCK_CONTACTS.length})</span>
                </div>

                <div className="messenger-contact-list-container" role="list">
                    {MOCK_CONTACTS.map(contact => (
                        <button
                            type="button"
                            key={contact.id}
                            className="messenger-contact-item"
                            onClick={() => onOpenChat(contact)}
                            role="listitem"
                            aria-label={`Chat with ${contact.name}, ${contact.status}`}
                        >
                            <div className="messenger-contact-avatar">
                                <div className="messenger-avatar-small" style={{ backgroundColor: contact.avatar }}></div>
                                <div className={`messenger-status-dot messenger-status-dot--${contact.status}`}></div>
                            </div>
                            <div className="messenger-contact-details">
                                <span className="messenger-contact-name">{contact.name}</span>
                                <span className="messenger-contact-status">{
                                    contact.status === 'online' ? t('messenger_status_chilling') :
                                        contact.status === 'busy' ? t('messenger_status_coding') : t('messenger_status_away')
                                }</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>


            <aside className="messenger-ad-banner" aria-label="Advertisement">
                {t('messenger_ad')}
            </aside>
        </div>
    );
};
