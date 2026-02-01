import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import './AboutPortfolio.css';

type Tab = 'overview' | 'architecture' | 'accessibility' | 'performance';

export const AboutPortfolio: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: t('about_tab_overview') },
        { id: 'architecture', label: t('about_tab_architecture') },
        { id: 'accessibility', label: t('about_tab_accessibility') },
        { id: 'performance', label: t('about_tab_performance') },
    ];

    return (
        <div className="about-portfolio">
            <div className="about-portfolio__tabs" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        className={`about-portfolio__tab ${activeTab === tab.id ? 'about-portfolio__tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="about-portfolio__content">
                {activeTab === 'overview' && (
                    <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_tech_stack')}</h2>
                            <div>
                                <span className="about-portfolio__badge">React 19</span>
                                <span className="about-portfolio__badge">TypeScript</span>
                                <span className="about-portfolio__badge">Vite</span>
                                <span className="about-portfolio__badge">Tailwind CSS v4</span>
                                <span className="about-portfolio__badge">i18next</span>
                                <span className="about-portfolio__badge">XState</span>
                                <span className="about-portfolio__badge">Vitest</span>
                                <span className="about-portfolio__badge">PWA</span>
                            </div>
                        </section>

                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_key_features')}</h2>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_window') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_wcag') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_i18n') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_mobile') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_perf') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_feat_monitor') }} />
                            </ul>
                        </section>

                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_why_title')}</h2>
                            <p className="about-portfolio__list-item mb-3">
                                {t('about_why_desc')}
                            </p>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item">
                                    {t('about_why_1')}
                                </li>
                                <li className="about-portfolio__list-item">
                                    {t('about_why_2')}
                                </li>
                                <li className="about-portfolio__list-item">
                                    {t('about_why_3')}
                                </li>
                                <li className="about-portfolio__list-item">
                                    {t('about_why_4')}
                                </li>
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'architecture' && (
                    <div id="panel-architecture" role="tabpanel" aria-labelledby="tab-architecture">
                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_arch_title')}</h2>

                            <h3 className="about-portfolio__subheading">{t('about_arch_1_title')}</h3>
                            <p className="about-portfolio__list-item mb-3">
                                {t('about_arch_1_desc')}
                            </p>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item">{t('about_arch_1_li_1')}</li>
                                <li className="about-portfolio__list-item">{t('about_arch_1_li_2')}</li>
                                <li className="about-portfolio__list-item">{t('about_arch_1_li_3')}</li>
                                <li className="about-portfolio__list-item">{t('about_arch_1_li_4')}</li>
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_arch_2_title')}</h3>
                            <p className="about-portfolio__list-item mb-3">
                                {t('about_arch_2_desc')}
                            </p>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_1') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_2') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_3') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_4') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_2_li_5') }} />
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_arch_3_title')}</h3>
                            <pre className="about-portfolio__code">
                                {`// BEM + Tailwind v4 Approach
.window {
  @apply flex flex-col bg-(--gray-300);
}

.window__title-bar {
  @apply flex items-center bg-(--blue-900);
}

.window__title-bar--active {
  @apply bg-(--blue-900);
}

// Design tokens for maintainability
--blue-900: rgb(80, 98, 150);
--gray-300: rgb(221, 230, 224);`}
                            </pre>

                            <h3 className="about-portfolio__subheading">{t('about_arch_4_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_1') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_2') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_3') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_arch_4_li_4') }} />
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'accessibility' && (
                    <div id="panel-accessibility" role="tabpanel" aria-labelledby="tab-accessibility">
                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_wcag_title')}</h2>

                            <h3 className="about-portfolio__subheading">{t('about_wcag_sr_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_1') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_2') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_3') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_sr_4') }} />
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_wcag_kb_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item">{t('about_wcag_kb_1')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_kb_2')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_kb_3')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_kb_4')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_kb_5')}</li>
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_wcag_vis_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_vis_1') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_vis_2') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_vis_3') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_wcag_vis_4') }} />
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_wcag_tools_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item">{t('about_wcag_tools_1')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_tools_2')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_tools_3')}</li>
                                <li className="about-portfolio__list-item">{t('about_wcag_tools_4')}</li>
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div id="panel-performance" role="tabpanel" aria-labelledby="tab-performance">
                        <section className="about-portfolio__section">
                            <h2 className="about-portfolio__heading">{t('about_perf_title')}</h2>

                            <h3 className="about-portfolio__subheading">{t('about_perf_code_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_code_1') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_code_2') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_code_3') }} />
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_perf_bundle_title')}</h3>
                            <div className="about-portfolio__metric">
                                <span className="about-portfolio__metric-label">{t('about_perf_target')}</span>
                                <span className="about-portfolio__metric-value" dangerouslySetInnerHTML={{ __html: t('about_perf_less_200') }} />
                            </div>
                            <div className="about-portfolio__metric">
                                <span className="about-portfolio__metric-label">{t('about_perf_tool')}</span>
                                <span className="about-portfolio__metric-value">rollup-plugin-visualizer</span>
                            </div>
                            <p className="about-portfolio__list-item mt-3" dangerouslySetInnerHTML={{ __html: t('about_perf_run_msg') }} />

                            <h3 className="about-portfolio__subheading">{t('about_perf_vitals_title')}</h3>
                            <p className="about-portfolio__list-item mb-3">
                                {t('about_perf_vitals_desc')}
                            </p>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_vitals_cls') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_vitals_fid') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_vitals_fcp') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_vitals_lcp') }} />
                                <li className="about-portfolio__list-item" dangerouslySetInnerHTML={{ __html: t('about_perf_vitals_ttfb') }} />
                            </ul>

                            <h3 className="about-portfolio__subheading">{t('about_perf_add_title')}</h3>
                            <ul className="about-portfolio__list">
                                <li className="about-portfolio__list-item">{t('about_perf_add_1')}</li>
                                <li className="about-portfolio__list-item">{t('about_perf_add_2')}</li>
                                <li className="about-portfolio__list-item">{t('about_perf_add_3')}</li>
                                <li className="about-portfolio__list-item">{t('about_perf_add_4')}</li>
                                <li className="about-portfolio__list-item">{t('about_perf_add_5')}</li>
                            </ul>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};
