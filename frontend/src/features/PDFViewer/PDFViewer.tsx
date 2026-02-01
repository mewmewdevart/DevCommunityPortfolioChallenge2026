import React from 'react';
import type { AppBaseProps, ProjectData } from '@interfaces/types';
import { useTranslation } from '@context/LanguageContext';
import './PDFViewer.css';

interface PDFViewerProps extends AppBaseProps {
  content?: ProjectData | string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ content }) => {
  const { t } = useTranslation();

  if (!content) {
    return (
      <div className="pdf-empty-state">
        {t('pdf_no_project')}
      </div>
    );
  }

  const isProjectData = typeof content === 'object' && content !== null && 'title' in content;

  if (!isProjectData) {
    return <div className="pdf-fallback-content">{String(content)}</div>;
  }

  const project = content as ProjectData;

  return (
    <div className="pdf-root">
      <div className="pdf-header-bar">
        <span className="pdf-header-text">
          | {project.title} - Portfolio
        </span>
      </div>

      <div className="pdf-content-container">
        <header>
          <h1 className="pdf-title">{project.title}</h1>
          <span className="pdf-subtitle">{project.subtitle}</span>
        </header>

        {project.banner && (
          <div className="pdf-banner-box">
            <img
              src={project.banner}
              alt={`${project.title} banner`}
              className="pdf-banner-img"
              loading="lazy"
              decoding="async"
              width={800}
              height={300}
            />
          </div>
        )}

        <section>
          <h3 className="pdf-section-title">
            {t('pdf_skills_used')}
          </h3>
          <ul className="pdf-skills-list">
            {project.skills.map((skill, index) => (
              <li
                key={index}
                className="pdf-skill-tag"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="pdf-section-title">
            {t('pdf_experience_details')}
          </h3>
          <p className="pdf-description">
            {project.description}
          </p>
        </section>

        {project.link && (
          <footer className="pdf-footer">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="pdf-link-btn"
            >
              {t('pdf_view_online')}
            </a>
          </footer>
        )}

        <div className="pdf-status-bar">
          <div className="pdf-status-item">
            {project.title}
          </div>
          <div className="pdf-status-item-right">
            <span>{t('pdf_page_count', { current: 1, total: 1 })}</span>
            <span>{t('pdf_status_web_layout')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};