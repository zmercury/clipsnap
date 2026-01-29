import { Clipboard, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    category: string;
    page_id: number;
    created_at: string;
}

interface ClipCardProps {
    clip: Clip;
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
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

export function ClipCard({ clip, onClick, onEdit, onDelete }: ClipCardProps) {
    return (
        <motion.div
            layout
            className="group relative bg-card/70 backdrop-blur-md border border-border/60 hover:border-primary/60 hover:bg-card/85 rounded-lg p-3 cursor-pointer shadow-sm transition-all duration-300 flex flex-col h-32"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={clsx("text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-sm truncate max-w-[100px] uppercase tracking-wide", getCategoryColor(clip.category))}>
                    {clip.category || "Uncategorized"}
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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

            <h3 className="text-sm font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{clip.heading}</h3>

            <div className="flex-1 overflow-hidden relative">
                <p className="text-xs text-muted-foreground/90 leading-snug break-words whitespace-pre-wrap line-clamp-3 font-normal">
                    {clip.content_text || "No text content"}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card/70 to-transparent pointer-events-none" />
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/50 font-medium">
                <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <Clipboard size={10} />
                </span>
            </div>
        </motion.div>
    );
}
