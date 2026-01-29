import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";


interface SearchBarProps {
    pages: Page[];
    onResultClick: (clip: Clip, page: Page) => void;
}

export function SearchBar({ pages, onResultClick }: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Clip[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery("");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const searchClips = async () => {
            if (query.trim().length > 0) {
                const clips = await window.api.db.searchClips(query);
                setResults(clips);
            } else {
                setResults([]);
            }
        };

        const debounce = setTimeout(searchClips, 200);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleResultClick = (clip: Clip) => {
        const page = pages.find(p => p.id === clip.page_id);
        if (page) {
            onResultClick(clip, page);
            setIsOpen(false);
            setQuery("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative w-full max-w-2xl bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden"
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                    <Search size={18} className="text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search clips across all pages... (Ctrl+K)"
                        className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/50"
                    />
                    <button
                        onClick={() => { setIsOpen(false); setQuery(""); }}
                        className="p-1 hover:bg-accent rounded-md transition-colors"
                    >
                        <X size={16} className="text-muted-foreground" />
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map(clip => {
                                const page = pages.find(p => p.id === clip.page_id);
                                return (
                                    <button
                                        key={clip.id}
                                        onClick={() => handleResultClick(clip)}
                                        className="w-full px-4 py-2.5 hover:bg-accent/50 transition-colors text-left flex items-start gap-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-semibold text-foreground truncate">{clip.heading}</h4>
                                                {clip.is_pinned === 1 && <span className="text-xs">📌</span>}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{clip.content_text}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                                                    {page?.icon} {page?.name}
                                                </span>
                                                {clip.category && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-muted/50 rounded text-muted-foreground">
                                                        {clip.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : query.trim().length > 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            No clips found for "{query}"
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            Start typing to search...
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
