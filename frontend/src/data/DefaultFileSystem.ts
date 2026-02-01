
import matter from 'gray-matter';

import SueTheRealBanner from '@assets/images/projects/sue-the-real.png';
import type { FileSystemItem, ProjectData } from '@interfaces/types';
import { APP_IDS } from './AppRegistry';

const validateProjectMetadata = (data: unknown): { success: true; data: ProjectData } | { success: false; error: string } => {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid data format' };
  }

  const typedData = data as Record<string, unknown>;

  if (!typedData.title || typeof typedData.title !== 'string' || typedData.title.length === 0) {
    return { success: false, error: 'Title is required' };
  }

  return {
    success: true,
    data: {
      title: typedData.title,
      subtitle: typeof typedData.subtitle === 'string' ? typedData.subtitle : '',
      banner: typeof typedData.banner === 'string' ? typedData.banner : '',
      skills: Array.isArray(typedData.skills) ? typedData.skills.filter((s: unknown): s is string => typeof s === 'string') : [],
      description: '', // This will be filled by the caller using the body content
      link: typeof typedData.link === 'string' ? typedData.link : '',
    }
  };
};

const markdownFiles = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const generatedProjectFiles: Record<string, FileSystemItem> = {};

Object.keys(markdownFiles).forEach((path) => {
  try {
    const rawContent = markdownFiles[path] as string;
    const { data: rawAttributes, content: body } = matter(rawContent);

    const validation = validateProjectMetadata(rawAttributes);

    if (!validation.success) {
      console.warn(`[MD] Arquivo ignorado (${path}):`, validation.error);
      return;
    }

    const metadata = validation.data;
    const fileName = path.split('/').pop() || 'unknown';
    const id = fileName.replace('.md', '');

    generatedProjectFiles[id] = {
      id,
      parentId: 'projects',
      name: fileName,
      type: 'file',
      appId: APP_IDS.PDF_VIEWER,
      content: {
        title: metadata.title,
        subtitle: metadata.subtitle,
        banner: metadata.banner,
        skills: metadata.skills,
        description: body,
        link: metadata.link,
      } as ProjectData,
    };
  } catch {
    return;
  }
});

export const DEFAULT_FS: Record<string, FileSystemItem> = {
  desktop: {
    id: 'desktop',
    parentId: null,
    name: 'Desktop',
    type: 'folder',
  },
  projects: {
    id: 'projects',
    parentId: null,
    name: 'Projects',
    type: 'folder',
  },
  recycle_bin: {
    id: 'recycle_bin',
    parentId: null,
    name: 'Recycle Bin',
    type: 'folder',
  },

  virus_installer: {
    id: 'virus_installer',
    parentId: 'recycle_bin',
    name: 'virus.exe',
    type: 'file',
    appId: APP_IDS.FAKEPATH,
  },

  sue_project_file: {
    id: 'sue_project_file',
    parentId: 'projects',
    name: 'Sue_The_Real.pdf',
    type: 'file',
    appId: APP_IDS.PDF_VIEWER,
    content: {
      title: 'Sue The Real',
      subtitle: 'Landing Page Web',
      banner: SueTheRealBanner,
      skills: ['React', 'Tailwind', 'Wordpress', 'SEO', 'Acessibilidade', 'Figma'],
      description: 'Lorem ipsum dolor sit amet...',
      link: 'https://suethereal.com',
    } as ProjectData,
  },

  ...generatedProjectFiles
};