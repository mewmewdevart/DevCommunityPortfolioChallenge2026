import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const SEO: React.FC = () => {
    const { t, i18n } = useTranslation();

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": "Larissa Cristina Benedito",
            "alternateName": "MewMewDev",
            "jobTitle": "Front-End Software Engineer",
            "image": "https://mewmewdevart.com/og-image.png",
            "url": "https://mewmewdevart.com",
            "sameAs": [
                "https://www.linkedin.com/in/mewmewdevart/",
                "https://github.com/mewmewdevart",
                "https://www.fiverr.com/mewmewdevart",
                "https://www.behance.net/MewmewDevArt",
                "https://www.instagram.com/mewmewdevart/",
                "https://mewmewdevart.itch.io/"
            ],
            "description": t('seo_description'),
            "knowsAbout": [
                "Front-End Development",
                "Web Accessibility",
                "Web Performance",
                "Design Systems",
                "React",
                "Angular",
                "JavaScript",
                "TypeScript",
                "HTML",
                "CSS",
                "Tailwind CSS",
                "SEO",
                "Scalable Front-End Architecture",
                "UI Engineering",
                "Open Source"
            ]
        }
    };

    return (
        <Helmet>
            <html lang={i18n.language || 'en'} />
            <title>{t('app_title', 'Retro Front-End Portfolio | Larissa Cristina Benedito')}</title>
            <meta name="description" content={t('seo_description')} />
            <meta name="keywords" content="retro portfolio, Windows 95, PlayStation 2, game, interactive curriculum" />
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>
        </Helmet>
    );
};
