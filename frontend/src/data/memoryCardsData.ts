
import matter from 'gray-matter';
import memoryCardCleanImage from '@/assets/images/game/memory-card_clean.png';
import memoryCardKirbyImage from '@/assets/images/game/memory-card_kirby.png';
import memoryCardDoubleVisionImage from '@/assets/images/game/memory-card_doubleVision.png';
import memoryCardSnake from '@/assets/images/game/memory-card_snake.png';

export interface MemoryCardData {
    id: string;
    title: string;
    size: string;
    image?: string;
    color: string;
    type: 'save' | 'data' | 'config' | 'corrupt' | 'empty';
    description?: string;
    tags?: string[];
    github?: string;
    linkToPlay?: string;
}

const IMAGE_MAP: Record<string, string> = {
    'memory-card_clean.png': memoryCardCleanImage,
    'memory-card_kirby.png': memoryCardKirbyImage,
    'memory-card_doubleVision.png': memoryCardDoubleVisionImage,
    'memory-card_snake.png': memoryCardSnake,
};

// Load MD files from videoGameData directory
const markdownFiles = import.meta.glob('./videoGameData/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const generatedCards: MemoryCardData[] = [];

Object.keys(markdownFiles).forEach((path) => {
    try {
        const rawContent = markdownFiles[path] as string;
        const { data: frontmatter, content: body } = matter(rawContent);

        // Derive ID from filename
        const fileName = path.split('/').pop() || 'unknown';
        const id = fileName.replace('.md', '');

        // Resolve image
        let imageResolved: string | undefined = undefined;
        if (frontmatter.image && IMAGE_MAP[frontmatter.image]) {
            imageResolved = IMAGE_MAP[frontmatter.image];
        }

        generatedCards.push({
            id: id,
            title: frontmatter.title || 'Untitled',
            size: frontmatter.size || '—',
            image: imageResolved,
            color: frontmatter.color || 'var(--gray-500)',
            type: (frontmatter.type as MemoryCardData['type']) || 'data',
            description: body.trim(),
            tags: frontmatter.tags || [],
            github: frontmatter.github,
            linkToPlay: frontmatter.linkToPlay,
        });
    } catch (e) {
        console.warn(`Failed to parse memory card data from ${path}`, e);
    }
});

// Sort cards if necessary (here we just sort by title to be consistent, or could add an 'order' field)
// For now, sorting by Title except "Free Space" usually goes last? 
// Let's just sort alphabetically by ID or keep filesystem order (which is usually alpha).
generatedCards.sort((a, b) => a.id.localeCompare(b.id));

// Fallback if no cards found
if (generatedCards.length === 0) {
    generatedCards.push({
        id: 'no-data',
        title: 'No Data',
        size: '0KB',
        color: 'var(--red-500)',
        type: 'empty',
        description: 'No memory cards found.',
    });
}

export const MEMORY_CARDS: MemoryCardData[] = generatedCards;

export const getMemoryCardImage = (card: MemoryCardData) => {
    return card.image ?? memoryCardCleanImage;
};
