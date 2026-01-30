import { Clipboard, Pencil, Trash2, Pin } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    category: string;
    page_id: number;
    is_pinned: number;
    content_type: string;
    created_at: string;
}

interface ClipCardProps {
    clip: Clip;
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    onTogglePin: (e: React.MouseEvent) => void;
    isPinned?: boolean;
    compact?: boolean;
}

function getCategoryColor(category: string) {
    const COLORS = [
        "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
        "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
        "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
        "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
        "bg-rose-500"
    ];
    if (!category) return "bg-gray-500";
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
}

function renderContent(text: string, contentType: string) {
    if (contentType === 'link') {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium" onClick={e => e.stopPropagation()}>{part}</a>;
            }
            return part;
        });
    }
    return text;
}

export function ClipCard({ clip, onClick, onEdit, onDelete, onTogglePin, isPinned = false, compact = false }: ClipCardProps) {
    // Compact View (List-like)
    if (compact && !isPinned) {
        return (
            <motion.div
                className="group relative bg-card/60 backdrop-blur-md border border-border/40 hover:border-primary/40 hover:bg-card/80 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-4 overflow-hidden"
                onClick={onClick}
            >
                <div className={clsx("w-1.5 h-6 rounded-full flex-shrink-0 shadow-sm", getCategoryColor(clip.category))} />

                <h3 className="text-sm font-bold text-foreground truncate min-w-[140px] max-w-[240px] tracking-tight">{clip.heading}</h3>

                <p className="text-xs text-muted-foreground/80 truncate flex-1 font-normal italic">
                    {clip.content_text || "No content"}
                </p>

                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity items-center">
                    <button onClick={onTogglePin} className="p-1.5 hover:bg-primary/10 rounded-md text-muted-foreground/60 hover:text-primary transition-all">
                        <Pin size={14} className={clip.is_pinned === 1 ? "fill-current" : ""} />
                    </button>
                    <button onClick={onEdit} className="p-1.5 hover:bg-primary/10 rounded-md text-muted-foreground/60 hover:text-primary transition-all">
                        <Pencil size={14} />
                    </button>
                    <button onClick={onDelete} className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground/60 hover:text-destructive transition-all">
                        <Trash2 size={14} />
                    </button>
                </div>
            </motion.div>
        );
    }

    // Grid/Pinned View
    const height = isPinned ? 'h-32' : 'h-48';
    const padding = isPinned ? 'p-3' : 'p-5';
    const headingSize = isPinned ? 'text-sm' : 'text-lg';
    const contentSize = isPinned ? 'text-xs' : 'text-sm';
    const tagSize = isPinned ? 'text-[10px]' : 'text-[11px]';

    return (
        <motion.div
            className={clsx(
                "group relative bg-card/70 backdrop-blur-md border border-border/60 hover:border-primary/60 hover:bg-card/85 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden",
                height,
                padding
            )}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={clsx("font-bold px-2 py-0.5 rounded-lg text-white shadow-sm truncate max-w-[140px] uppercase tracking-wider", tagSize, getCategoryColor(clip.category))}>
                    {clip.category || "Uncategorized"}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onTogglePin}
                        className={clsx(
                            "p-1.5 rounded-md transition-all",
                            clip.is_pinned === 1
                                ? "bg-primary/20 text-primary hover:bg-primary/30"
                                : "hover:bg-background/80 text-muted-foreground hover:text-primary"
                        )}
                        title={clip.is_pinned === 1 ? "Unpin" : "Pin"}
                    >
                        <Pin size={14} className={clip.is_pinned === 1 ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-primary transition-all"
                        title="Edit"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-destructive transition-all"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className={clsx(headingSize, "font-extrabold text-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight mb-2")}>
                {clip.heading}
            </h3>

            <div className="flex-1 overflow-hidden relative">
                <p className={clsx(contentSize, "text-muted-foreground/90 leading-relaxed break-words whitespace-pre-wrap font-normal", isPinned ? "line-clamp-2" : "line-clamp-4")}>
                    {renderContent(clip.content_text || "No text content", clip.content_type)}
                </p>
                {!isPinned && <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground/60 font-semibold tracking-wide border-t border-border/10 pt-3">
                <span>{new Date(clip.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
                    <Clipboard size={12} className="opacity-40 group-hover:opacity-100" />
                    <span className="uppercase opacity-0 group-hover:opacity-100 transition-all">Copy</span>
                </span>
            </div>
        </motion.div>
    );
}
