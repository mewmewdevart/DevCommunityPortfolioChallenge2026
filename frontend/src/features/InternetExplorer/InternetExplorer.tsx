import { useEffect, useState } from 'react';
import { WinButton } from '@atoms/WinButton/WinButton';
import { useTranslation } from '@context/LanguageContext';
import iconArrowLeft from 'pixelarticons/svg/arrow-left.svg';
import iconArrowRight from 'pixelarticons/svg/arrow-right.svg';
import iconClose from 'pixelarticons/svg/close.svg';
import iconReload from 'pixelarticons/svg/reload.svg';
import iconHome from 'pixelarticons/svg/home.svg';
import iconSearch from 'pixelarticons/svg/search.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';

import './InternetExplorer.css';

export const InternetExplorer = () => {
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
    {
      id: 2,
      title: 'Pocket Sue',
      description: t('project_pocket_desc'),
      url: 'https://pocket-sue.com',
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
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
    <div className="ie-root">
      {/* Toolbar */}
      <div className="ie-toolbar">
        <WinButton className="ie-toolbar-btn" title={t('ie_back')}>
          <IconRenderer icon={iconArrowLeft} size={16} />
        </WinButton>

        <WinButton className="ie-toolbar-btn" title={t('ie_forward')}>
          <IconRenderer icon={iconArrowRight} size={16} />
        </WinButton>

        <WinButton className="ie-toolbar-btn" title={t('ie_stop')}>
          <IconRenderer icon={iconClose} size={16} />
        </WinButton>

        <WinButton
          className="ie-toolbar-btn"
          title={t('ie_refresh')}
          onClick={simulateNavigation}
        >
          <IconRenderer icon={iconReload} size={16} />
        </WinButton>

        <WinButton
          className="ie-toolbar-btn"
          title={t('ie_home')}
          onClick={simulateNavigation}
        >
          <IconRenderer icon={iconHome} size={16} />
        </WinButton>

        <div className="ie-toolbar-divider" />

        <WinButton className="ie-toolbar-btn" title={t('ie_search')}>
          <IconRenderer icon={iconSearch} size={16} />
        </WinButton>
      </div>

      {/* Address Bar */}
      <div className="ie-address-bar">
        <label htmlFor="ie-address-input" className="ie-address-label">{t('address_label')}</label>
        <form onSubmit={simulateNavigation} className="ie-address-form">
          <input
            id="ie-address-input"
            name="url"
            type="text"
            className="ie-address-input"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            maxLength={2048}
          />
        </form>
      </div>

      {/* Content */}
      <div className="ie-content">
        {loading && (
          <div className="ie-loading-overlay">
            <div className="ie-loading-box">
              <p>{t('loading_contacting')}</p>
            </div>
          </div>
        )}

        {!loading && (
          <section>
            <div className="ie-page-container">
              {/* Header */}
              <div className="ie-page-header">
                <span className="ie-page-welcome">{t('welcome_to')}</span>
                <h1 className="ie-page-title">
                  Larissa Cristina Benedito
                </h1>
                <p className="ie-page-subtitle">{t('frontend_portfolio')}</p>
              </div>

              {/* Navigation */}
              <div className="ie-page-nav">
                <a href="#about" className="ie-nav-link">
                  {t('about')}
                </a>
                <a href="#skills" className="ie-nav-link">
                  {t('skills')}
                </a>
                <a href="#projects" className="ie-nav-link">
                  {t('projects')}
                </a>
                <a href="#contact" className="ie-nav-link">
                  {t('contact')}
                </a>
              </div>

              {/* About */}
              <div id="about" className="ie-section-box">
                <h2 className="ie-section-title">{t('about_me')}</h2>
                <p className="ie-page-text">
                  {t('about_description')}
                </p>
              </div>

              {/* Skills */}
              <div id="skills" className="ie-section-box">
                <h2 className="ie-section-title">{t('skills')}</h2>
                <ul className="ie-list">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Projects */}
              <div id="projects" className="ie-section-box">
                <h2 className="ie-section-title">{t('projects')}</h2>

                <ul className="ie-project-list">
                  {projects.map((project) => (
                    <li key={project.id}>
                      ➜{' '}
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ie-nav-link"
                        >
                          {project.title}
                        </a>
                      ) : (
                        <span className="ie-project-title">
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
              <div id="contact" className="ie-section-box ie-page-text">
                <h2 className="ie-section-title">{t('contact')}</h2>
                <p>{t('label_email')}: mewmewdevart@gmail.com</p>
                <p>GitHub: github.com/mewmewdevart</p>
                <p>{t('label_website')}: mewmewdevart.com</p>
              </div>

              {/* Footer */}
              <div className="ie-footer">
                {t('ie_footer_copy')}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Status Bar */}
      <div className="ie-status-bar">
        {loading ? t('status_opening') : t('status_done')}
      </div>
    </div>
  );
};
