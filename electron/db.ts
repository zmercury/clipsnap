import Store from 'electron-store';

export interface Page {
    id: number;
    name: string;
    icon: string;
    created_at: string;
}

export interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    category: string;
    page_id: number;
    is_pinned: number;
    content_type: string;
    order_index: number;
    created_at: string;
}

interface Schema {
    pages: Page[];
    clips: Clip[];
    pageIdCounter: number;
    clipIdCounter: number;
}

const store = new Store<Schema>({
    defaults: {
        pages: [],
        clips: [],
        pageIdCounter: 1,
        clipIdCounter: 1,
    },
});

// Initialize database
export function initDB() {
    const pages = store.get('pages');
    if (pages.length === 0) {
        addPage('My First Page', '📝');
        // If we just added a page, we need to get the ID of that new page
        // Since it's the first one, it should be 1, but let's be safe
        const newPages = store.get('pages');
        if (newPages.length > 0) {
            // If we had orphaned clips (implied by previous logic), we might adhere to them,
            // but since we are migrating/starting fresh with store, we might not implementation complex migration logic from SQLite
            // unless the user explicitly asked for data migration, which they didn't. 
            // They wanted to "remove sqlite". 
            // So for a fresh start or simple store usage:
        }
    }
}

// Page functions
export function getPages(): Page[] {
    return store.get('pages').sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addPage(name: string, icon: string = '📄') {
    const pages = store.get('pages');
    const id = store.get('pageIdCounter');

    const newPage: Page = {
        id,
        name,
        icon,
        created_at: new Date().toISOString(),
    };

    store.set('pages', [...pages, newPage]);
    store.set('pageIdCounter', id + 1);

    return { lastInsertRowid: id, changes: 1 }; // Return SQLite-like result for compatibility if needed, distinct from previous result type which was RunResult
}

export function updatePage(id: number, name: string, icon: string) {
    const pages = store.get('pages');
    const index = pages.findIndex(p => p.id === id);
    if (index !== -1) {
        pages[index] = { ...pages[index], name, icon };
        store.set('pages', pages);
        return { changes: 1 };
    }
    return { changes: 0 };
}

export function deletePage(id: number) {
    const pages = store.get('pages');
    const newPages = pages.filter(p => p.id !== id);
    store.set('pages', newPages);

    // Cascade delete clips
    const clips = store.get('clips');
    const newClips = clips.filter(c => c.page_id !== id);
    store.set('clips', newClips);

    return { changes: pages.length - newPages.length };
}

// Clip functions
export function getClips(pageId?: number): Clip[] {
    const clips = store.get('clips');
    let filteredClips = clips;

    // Log for debugging
    console.log(`[db] getClips called with pageId: ${pageId} (${typeof pageId})`);

    if (pageId !== undefined && pageId !== null) {
        // Ensure comparison matches types (store usually keeps numbers as numbers, but just in case)
        filteredClips = clips.filter(c => Number(c.page_id) === Number(pageId));
    } else {
        console.log('[db] getClips called without pageId, returning ALL clips (this might be unintentional)');
    }

    console.log(`[db] getClips returning ${filteredClips.length} clips (total: ${clips.length})`);

    return filteredClips.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
            return b.is_pinned - a.is_pinned; // Pinned first
        }
        // Then by order_index
        return (a.order_index || 0) - (b.order_index || 0);
    });
}

export function addClip(heading: string, content_html: string, content_text: string, category: string, pageId: number, contentType: string = 'text') {
    const clips = store.get('clips');
    const id = store.get('clipIdCounter');

    console.log(`[db] addClip for pageId: ${pageId} (${typeof pageId})`);

    const newClip: Clip = {
        id,
        heading,
        content_html,
        content_text,
        category,
        page_id: Number(pageId), // Ensure number
        is_pinned: 0,
        content_type: contentType,
        order_index: -Date.now(), // New clips at the top by default (negative timestamp for ascending sort)
        created_at: new Date().toISOString(),
    };

    store.set('clips', [...clips, newClip]);
    store.set('clipIdCounter', id + 1);

    return { lastInsertRowid: id, changes: 1 };
}

export function updateClip(id: number, heading: string, content_html: string, content_text: string, category: string) {
    const clips = store.get('clips');
    const index = clips.findIndex(c => c.id === id);
    if (index !== -1) {
        clips[index] = { ...clips[index], heading, content_html, content_text, category };
        store.set('clips', clips);
        return { changes: 1 };
    }
    return { changes: 0 };
}

export function deleteClip(id: number) {
    const clips = store.get('clips');
    const newClips = clips.filter(c => c.id !== id);
    store.set('clips', newClips);
    return { changes: clips.length - newClips.length };
}

export function togglePinClip(id: number) {
    const clips = store.get('clips');
    const index = clips.findIndex(c => c.id === id);
    if (index !== -1) {
        clips[index].is_pinned = clips[index].is_pinned ? 0 : 1;
        store.set('clips', clips);
        return { changes: 1 };
    }
    return { changes: 0 };
}

export function searchClips(query: string): Clip[] {
    const clips = store.get('clips');
    const lowerQuery = query.toLowerCase();

    const filtered = clips.filter(c =>
        c.heading.toLowerCase().includes(lowerQuery) ||
        c.content_text.toLowerCase().includes(lowerQuery)
    );

    return filtered.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
            return b.is_pinned - a.is_pinned;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}
export function updateClipsOrder(orders: { id: number, order_index: number }[]) {
    const clips = store.get('clips');
    orders.forEach(order => {
        const index = clips.findIndex(c => c.id === order.id);
        if (index !== -1) {
            clips[index].order_index = order.order_index;
        }
    });
    store.set('clips', clips);
    return { changes: orders.length };
}
