import { useEffect, useState } from 'react';
import { useTranslation } from '@context/LanguageContext';
import './Google.css';


export const Google = () => {
  const { t } = useTranslation();
  const FAKE_URL = 'http://mewmewdevart.com';

  const [inputUrl, setInputUrl] = useState(FAKE_URL);
  const [loading, setLoading] = useState(true);

  const skills = [
    t('skill_html'),
    t('skill_js'),
    t('skill_react'),
    t('skill_a11y'),
    t('skill_perf'),
  ];

  const projects = [
    {
      id: 1,
      title: 'Sue The Real',
      description: t('project_sue_desc'),
      url: 'https://suethereal.com',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const simulateNavigation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setInputUrl(FAKE_URL);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="google-root">
      <div className="google-address-bar">
        <label htmlFor="google-address-input" className="google-address-label">{t('address_label')}</label>
        <form onSubmit={simulateNavigation} className="google-address-form">
          <input
            id="google-address-input"
            name="url"
            type="text"
            className="google-address-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            maxLength={2048}
          />
        </form>
      </div>

      <div className="google-content">
        {loading && (
          <div className="google-loading-overlay">
            <div className="google-loading-box">
              <p>{t('loading_contacting')}</p>
            </div>
          </div>
        )}

        {!loading && (
          <section>
            <div className="google-page-container">
              <div className="google-page-header">
                <span className="google-page-welcome">{t('welcome_to')}</span>
                <h1 className="google-page-title">
                  Larissa Cristina Benedito
                </h1>
                <p className="google-page-subtitle">{t('frontend_portfolio')}</p>
              </div>

              <div className="google-page-nav">
                <a href="#summary" className="google-nav-link">
                  {t('resume_summary_title')}
                </a>
                <a href="#experience" className="google-nav-link">
                  {t('resume_exp_title')}
                </a>
                <a href="#education" className="google-nav-link">
                  {t('resume_edu_title')}
                </a>
                <a href="#contact" className="google-nav-link">
                  {t('contact')}
                </a>
              </div>

              <div id="summary" className="google-section-box">
                <h2 className="google-section-title">{t('resume_summary_title')}</h2>
                <p className="google-page-text">
                  {t('resume_summary_content')}
                </p>
              </div>

              <div id="experience" className="google-section-box">
                <h2 className="google-section-title">{t('resume_exp_title')}</h2>

                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_exp_job1_role')}</h3>
                  <p className="google-resume-company">{t('resume_exp_job1_company')}</p>
                  <p className="google-resume-desc">{t('resume_exp_job1_desc')}</p>
                </div>

                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_exp_job2_role')}</h3>
                  <p className="google-resume-company">{t('resume_exp_job2_company')}</p>
                  <p className="google-resume-desc">{t('resume_exp_job2_desc')}</p>
                </div>

                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_exp_job3_role')}</h3>
                  <p className="google-resume-company">{t('resume_exp_job3_company')}</p>
                  <p className="google-resume-desc">{t('resume_exp_job3_desc')}</p>
                </div>
              </div>

              <div id="education" className="google-section-box">
                <h2 className="google-section-title">{t('resume_edu_title')}</h2>

                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_edu_college1_course')}</h3>
                  <p className="google-resume-company">{t('resume_edu_college1_name')} | {t('resume_edu_college1_date')}</p>
                  <p className="google-resume-desc">{t('resume_edu_college1_desc')}</p>
                </div>

                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_edu_college2_course')}</h3>
                  <p className="google-resume-company">{t('resume_edu_college2_name')} | {t('resume_edu_college2_date')}</p>
                  <p className="google-resume-desc">{t('resume_edu_college2_desc')}</p>
                </div>
              </div>

              <div id="volunteering" className="google-section-box">
                <h2 className="google-section-title">{t('resume_vol_title')}</h2>
                <div className="google-resume-item">
                  <h3 className="google-resume-role">{t('resume_vol_role')}</h3>
                  <p className="google-resume-company">{t('resume_vol_org')}</p>
                  <p className="google-resume-desc">{t('resume_vol_desc')}</p>
                </div>
              </div>

              <div id="contact" className="google-section-box google-page-text">
                <h2 className="google-section-title">{t('contact')}</h2>
                <p>
                  {t('label_email')}: <a href="mailto:mewmewdevart@gmail.com" className="google-nav-link">mewmewdevart@gmail.com</a>
                </p>
                <p>
                  Linkedin: <a href="https://linkedin.com/in/mewmewdevart" className="google-nav-link" target="_blank" rel="noopener noreferrer">linkedin.com/in/mewmewdevart</a>
                </p>
                <p>
                  GitHub: <a href="https://github.com/mewmewdevart" className="google-nav-link" target="_blank" rel="noopener noreferrer">github.com/mewmewdevart</a>
                </p>

              </div>

              <div className="google-footer">
                {t('google_footer_copy')}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Status Bar */}
      <div className="google-status-bar">
        {loading ? t('status_opening') : t('status_done')}
      </div>
    </div>
  );
};
