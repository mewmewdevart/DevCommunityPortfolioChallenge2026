export type ViewState = 'login' | 'contacts' | 'chat';
export type Status = 'online' | 'busy' | 'offline';

export interface Contact {
    id: string;
    name: string;
    status: Status;
    avatar: string;
}

export interface Message {
    id: string;
    sender: 'me' | 'them';
    text: string;
    timestamp: Date;
}
