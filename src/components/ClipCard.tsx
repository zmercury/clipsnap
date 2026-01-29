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
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()}>{part}</a>;
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
                className="group relative bg-card/60 backdrop-blur-md border border-border/40 hover:border-primary/40 hover:bg-card/80 rounded-md px-3 py-2 cursor-pointer transition-all duration-200 flex items-center gap-3 overflow-hidden"
                onClick={onClick}
            >
                <div className={clsx("w-1 h-4 rounded-full flex-shrink-0", getCategoryColor(clip.category))} />

                <h3 className="text-xs font-semibold text-foreground truncate min-w-[120px] max-w-[200px] tracking-tight">{clip.heading}</h3>

                <p className="text-[11px] text-muted-foreground/70 truncate flex-1 font-normal">
                    {clip.content_text || "No content"}
                </p>

                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onTogglePin} className="p-1 hover:bg-background/80 rounded text-muted-foreground/60 hover:text-primary transition-colors">
                        <Pin size={11} className={clip.is_pinned === 1 ? "fill-current" : ""} />
                    </button>
                    <button onClick={onEdit} className="p-1 hover:bg-background/80 rounded text-muted-foreground/60 hover:text-primary transition-colors">
                        <Pencil size={11} />
                    </button>
                    <button onClick={onDelete} className="p-1 hover:bg-background/80 rounded text-muted-foreground/60 hover:text-destructive transition-colors">
                        <Trash2 size={11} />
                    </button>
                </div>
            </motion.div>
        );
    }

    // Grid/Pinned View
    const height = isPinned ? 'h-20' : 'h-32';
    const padding = isPinned ? 'p-2' : 'p-3';
    const textSize = isPinned ? 'text-xs' : 'text-sm';
    const contentSize = isPinned ? 'text-[10px]' : 'text-xs';

    return (
        <motion.div
            className={clsx(
                "group relative bg-card/70 backdrop-blur-md border border-border/60 hover:border-primary/60 hover:bg-card/85 rounded-lg cursor-pointer shadow-sm transition-all duration-300 flex flex-col",
                height,
                padding
            )}
            onClick={onClick}
        >
            <div className={clsx("flex justify-between items-start", isPinned ? "mb-1" : "mb-2")}>
                <div className={clsx("text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-sm truncate max-w-[100px] uppercase tracking-wide", getCategoryColor(clip.category))}>
                    {clip.category || "Uncategorized"}
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onTogglePin}
                        className={clsx(
                            "p-1 rounded transition-colors",
                            clip.is_pinned === 1
                                ? "bg-primary/20 text-primary hover:bg-primary/30"
                                : "hover:bg-background/80 text-muted-foreground hover:text-primary"
                        )}
                        title={clip.is_pinned === 1 ? "Unpin" : "Pin"}
                    >
                        <Pin size={12} className={clip.is_pinned === 1 ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1 hover:bg-background/80 rounded text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <Pencil size={12} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-background/80 rounded text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            <h3 className={clsx(textSize, "font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight", isPinned ? "mb-0.5" : "mb-1.5")}>{clip.heading}</h3>

            <div className="flex-1 overflow-hidden relative">
                <p className={clsx(contentSize, "text-muted-foreground/90 leading-snug break-words whitespace-pre-wrap font-normal", isPinned ? "line-clamp-1" : "line-clamp-3")}>
                    {renderContent(clip.content_text || "No text content", clip.content_type)}
                </p>
                {!isPinned && <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card/70 to-transparent pointer-events-none" />}
            </div>

            {!isPinned && (
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/50 font-medium">
                    <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <Clipboard size={10} />
                    </span>
                </div>
            )}
        </motion.div>
    );
}
