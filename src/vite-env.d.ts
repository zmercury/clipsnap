/// <reference types="vite/client" />

interface Page {
    id: number;
    name: string;
    icon: string;
    created_at: string;
}

interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    category: string;
    page_id: number;
    created_at: string;
}

interface Window {
    api: {
        window: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
        db: {
            getPages: () => Promise<Page[]>;
            addPage: (page: { name: string; icon: string }) => Promise<any>;
            updatePage: (page: { id: number; name: string; icon: string }) => Promise<any>;
            deletePage: (id: number) => Promise<any>;
            getClips: (pageId?: number) => Promise<Clip[]>;
            addClip: (clip: { heading: string; content_html: string; content_text: string; category: string; pageId: number }) => Promise<any>;
            updateClip: (clip: { id: number; heading: string; content_html: string; content_text: string; category: string }) => Promise<any>;
            deleteClip: (id: number) => Promise<any>;
        };
        clipboard: {
            read: () => Promise<{ text: string; html: string }>;
            write: (content: { text: string; html?: string }) => Promise<void>;
        };
    };
}
