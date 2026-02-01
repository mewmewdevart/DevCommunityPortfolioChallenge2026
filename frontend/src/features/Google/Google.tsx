import { useEffect, useState } from 'react';
import { useTranslation } from '@context/LanguageContext';
import './Google.css';
// import googleLogo from '@assets/icons/icon-internet-explorer.png';

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
      {/* Address Bar */}
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

      {/* Content */}
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
              {/* Header */}
              <div className="google-page-header">
                <span className="google-page-welcome">{t('welcome_to')}</span>
                <h1 className="google-page-title">
                  Larissa Cristina Benedito
                </h1>
                <p className="google-page-subtitle">{t('frontend_portfolio')}</p>
              </div>

              {/* Navigation */}
              <div className="google-page-nav">
                <a href="#about" className="google-nav-link">
                  {t('about')}
                </a>
                <a href="#skills" className="google-nav-link">
                  {t('skills')}
                </a>
                <a href="#projects" className="google-nav-link">
                  {t('projects')}
                </a>
                <a href="#contact" className="google-nav-link">
                  {t('contact')}
                </a>
              </div>

              {/* About */}
              <div id="about" className="google-section-box">
                <h2 className="google-section-title">{t('about_me')}</h2>
                <p className="google-page-text">
                  {t('about_description')}
                </p>
              </div>

              {/* Skills */}
              <div id="skills" className="google-section-box">
                <h2 className="google-section-title">{t('skills')}</h2>
                <ul className="google-list">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Projects */}
              <div id="projects" className="google-section-box">
                <h2 className="google-section-title">{t('projects')}</h2>

                <ul className="google-project-list">
                  {projects.map((project) => (
                    <li key={project.id}>
                      ➜{' '}
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="google-nav-link"
                        >
                          {project.title}
                        </a>
                      ) : (
                        <span className="google-project-title">
                          {project.title}
                        </span>
                      )}
                      {' — '}
                      {project.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div id="contact" className="google-section-box google-page-text">
                <h2 className="google-section-title">{t('contact')}</h2>
                <p>{t('label_email')}: mewmewdevart@gmail.com</p>
                <p>GitHub: github.com/mewmewdevart</p>
                <p>{t('label_website')}: mewmewdevart.com</p>
              </div>

              {/* Footer */}
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
