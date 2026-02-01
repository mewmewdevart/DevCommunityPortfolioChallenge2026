import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import RefreshIcon from '@assets/icons/mini_icon_refresh.png';
import { useTranslation } from '@/context/LanguageContext';
import type { TranslationKeys } from '@/utils/translationsKeys';

import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
    t: (key: TranslationKeys) => string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundaryInner extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        const { t } = this.props;

        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1 className="error-boundary__title">{t('errorBoundary_title')}</h1>
                    <p className="error-boundary__message">
                        {t('errorBoundary_desc')}
                    </p>

                    <div className="error-boundary__details">
                        <p className="error-boundary__error-text">Error: {this.state.error?.message}</p>
                        <p className="error-boundary__hint">
                            {t('errorBoundary_hint')}
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="error-boundary__restart-btn"
                    >
                        <img src={RefreshIcon} alt="" className="error-boundary__action-icon" />
                        {t('errorBoundary_restart')}
                    </button>

                    <p className='error-boundary__contact-text'>
                        {t('errorBoundary_contact')}
                        <a href="https://linktr.ee/mewmewdevart" target="_blank" rel="noopener noreferrer">{t('errorBoundary_contact_link')}</a>
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = (props) => {
    const { t } = useTranslation();
    return <ErrorBoundaryInner t={t} {...props} />;
};
