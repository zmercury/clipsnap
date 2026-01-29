/// <reference types="vite/client" />

interface Window {
    api: {
        window: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
        };
        db: {
            getClips: () => Promise<{ id: number; heading: string; content_html: string; content_text: string; created_at: string }[]>;
            addClip: (clip: { heading: string; content_html: string; content_text: string }) => Promise<any>;
            deleteClip: (id: number) => Promise<any>;
        };
        clipboard: {
            read: () => Promise<{ text: string; html: string }>;
            write: (content: { text: string; html?: string }) => Promise<void>;
        };
    };
}
