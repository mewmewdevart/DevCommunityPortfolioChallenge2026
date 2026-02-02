import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import './Welcome.css';

type Tab = 'welcome' | 'overview' | 'architecture' | 'accessibility' | 'performance';

export const Welcome = () => {
  const { t } = useTranslation();
  const { playSound } = useSound();
  const [activeTab, setActiveTab] = useState<Tab>('welcome');

  useEffect(() => {
    playSound('success');
  }, [playSound]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'welcome', label: t('welcome_title') },
    { id: 'overview', label: t('about_tab_overview') },
    { id: 'architecture', label: t('about_tab_architecture') },
    { id: 'accessibility', label: t('about_tab_accessibility') },
    { id: 'performance', label: t('about_tab_performance') },
  ];

  return (
    <div className="welcome">
      <div className="welcome__header">
        <h1 className="welcome__title">{t('welcome_title')}</h1>
        <p className="welcome__subtitle">{t('welcome_subtitle')}</p>
      </div>

      <div className="welcome__tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`welcome__tab ${activeTab === tab.id ? 'welcome__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="welcome__content">
        {activeTab === 'welcome' && (
          <div id="panel-welcome" role="tabpanel">
            <p className="welcome__text">{t('welcome_intro')}</p>
            <p className="welcome__text"><strong>{t('welcome_features_title')}</strong></p>
            <ul className="welcome__list">
              <li>{t('welcome_feature_1')}</li>
              <li>{t('welcome_feature_2')}</li>
              <li>{t('welcome_feature_3')}</li>
              <li>{t('welcome_feature_4')}</li>
              <li>{t('welcome_feature_5')}</li>
              <li>{t('welcome_feature_6')}</li>
            </ul>
            <p className="welcome__footer">{t('welcome_footer')}</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div id="panel-overview" role="tabpanel">
            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_tech_stack')}</h2>
              <div>
                <span className="welcome__badge">React 19</span>
                <span className="welcome__badge">TypeScript</span>
                <span className="welcome__badge">Vite</span>
                <span className="welcome__badge">Tailwind CSS v4</span>
                <span className="welcome__badge">i18next</span>
                <span className="welcome__badge">XState</span>
                <span className="welcome__badge">Vitest</span>
                <span className="welcome__badge">PWA</span>
              </div>
            </section>

            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_key_features')}</h2>
              <ul className="welcome__list">
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_window') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_wcag') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_i18n') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_mobile') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_perf') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_feat_monitor') }} />
              </ul>
            </section>

            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_why_title')}</h2>
              <p className="welcome__text mb-3">{t('about_why_desc')}</p>
              <ul className="welcome__list">
                <li>{t('about_why_1')}</li>
                <li>{t('about_why_2')}</li>
                <li>{t('about_why_3')}</li>
                <li>{t('about_why_4')}</li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div id="panel-architecture" role="tabpanel">
            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_arch_title')}</h2>

              <h3 className="welcome__subheading">{t('about_arch_1_title')}</h3>
              <p className="welcome__text mb-3">{t('about_arch_1_desc')}</p>
              <ul className="welcome__list">
                <li>{t('about_arch_1_li_1')}</li>
                <li>{t('about_arch_1_li_2')}</li>
                <li>{t('about_arch_1_li_3')}</li>
                <li>{t('about_arch_1_li_4')}</li>
              </ul>

              <h3 className="welcome__subheading">{t('about_arch_2_title')}</h3>
              <p className="welcome__text mb-3">{t('about_arch_2_desc')}</p>
              <ul className="welcome__list">
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_1') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_2') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_3') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_4') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_5') }} />
              </ul>

              <h3 className="welcome__subheading">{t('about_arch_3_title')}</h3>
              <pre className="welcome__code">
                {`// BEM + Tailwind v4 Approach
                  .window {
                    @apply flex flex-col bg-(--gray-300);
                  }

                  .window__title-bar {
                    @apply flex items-center bg-(--blue-900);
                  }

                  // ...`}
              </pre>

              <h3 className="welcome__subheading">{t('about_arch_4_title')}</h3>
              <ul className="welcome__list">
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_1') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_2') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_3') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_4') }} />
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div id="panel-accessibility" role="tabpanel">
            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_wcag_title')}</h2>

              <h3 className="welcome__subheading">{t('about_wcag_sr_title')}</h3>
              <ul className="welcome__list">
                <li dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_1') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_2') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_3') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_4') }} />
              </ul>

              <h3 className="welcome__subheading">{t('about_wcag_kb_title')}</h3>
              <ul className="welcome__list">
                <li>{t('about_wcag_kb_1')}</li>
                <li>{t('about_wcag_kb_2')}</li>
                <li>{t('about_wcag_kb_3')}</li>
                <li>{t('about_wcag_kb_4')}</li>
                <li>{t('about_wcag_kb_5')}</li>
              </ul>
            </section>
          </div>
        )}

        {activeTab === 'performance' && (
          <div id="panel-performance" role="tabpanel">
            <section className="welcome__section">
              <h2 className="welcome__heading">{t('about_perf_title')}</h2>

              <h3 className="welcome__subheading">{t('about_perf_code_title')}</h3>
              <ul className="welcome__list">
                <li dangerouslySetInnerHTML={{ __html: t('about_perf_code_1') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_perf_code_2') }} />
                <li dangerouslySetInnerHTML={{ __html: t('about_perf_code_3') }} />
              </ul>

              <h3 className="welcome__subheading">{t('about_perf_bundle_title')}</h3>
              <div className="welcome__metric">
                <span className="welcome__metric-label">{t('about_perf_target')}</span>
                <span className="welcome__metric-value" dangerouslySetInnerHTML={{ __html: t('about_perf_less_200') }} />
              </div>
              <p className="welcome__text mt-3" dangerouslySetInnerHTML={{ __html: t('about_perf_run_msg') }} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
