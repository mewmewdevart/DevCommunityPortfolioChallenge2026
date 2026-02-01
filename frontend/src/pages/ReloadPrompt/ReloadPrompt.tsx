import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'
import { useTranslation } from '@/context/LanguageContext'
import './ReloadPrompt.css'

export function ReloadPrompt() {
    const { t } = useTranslation()
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered() {
            // console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    useEffect(() => {
        if (offlineReady) {
            console.log('App is ready to work offline')
        }
    }, [offlineReady])

    return (
        <div className="reload-prompt">
            {(offlineReady || needRefresh) && (
                <div className="reload-prompt__toast">
                    <div className="reload-prompt__message">
                        {offlineReady ? (
                            <span>{t('app_ready_offline')}</span>
                        ) : (
                            <span>{t('new_content_available')}</span>
                        )}
                    </div>
                    <div className="reload-prompt__actions">
                        {needRefresh && (
                            <button
                                className="reload-prompt__btn reload-prompt__btn--reload"
                                onClick={() => updateServiceWorker(true)}
                            >
                                {t('reload')}
                            </button>
                        )}
                        <button
                            className="reload-prompt__btn reload-prompt__btn--close"
                            onClick={() => close()}
                        >
                            {t('close_button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
