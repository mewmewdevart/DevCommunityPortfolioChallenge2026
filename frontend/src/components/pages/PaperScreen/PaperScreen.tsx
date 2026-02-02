import { useEffect, useRef } from 'react';
import './PaperScreen.css';
import { useTranslation } from '@/context/LanguageContext';

export function PaperFold() {
    const { t } = useTranslation();
    const paperRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (paperRef.current) {
            paperRef.current.focus();
        }
    }, []);

    return (
        <main className="paper-wrapper">
            <article
                ref={paperRef}
                className="paper-fold outline-none"
                aria-label="Curriculum"
                tabIndex={-1}
            >
                <div className="paper-lines">
                    <section
                        className="paper-text"
                        spellCheck={false}
                    >
                        <h1 className="text-xl md:text-2xl mb-8 font-bold text-gray-900">
                            {t('paper_text_intro')}
                        </h1>
                        <p className="mb-8 text-base md:text-lg text-gray-800 leading-[32px]">
                            {t('paper_text_body')}
                        </p>
                        <p className="text-sm text-gray-600 italic mt-8 leading-[32px]">
                            {t('paper_cupcake_ipsum')}
                        </p>
                    </section>
                </div>

                <span className="paper-hole hole-top" aria-hidden="true" />
                <span className="paper-hole hole-middle" aria-hidden="true" />
                <span className="paper-hole hole-bottom" aria-hidden="true" />
            </article>
        </main>
    )
}
