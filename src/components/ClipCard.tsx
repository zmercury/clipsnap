import { motion } from "framer-motion";
import { Clipboard, Pencil, Trash2 } from "lucide-react";
import { clsx } from "clsx";

interface Clip {
    id: number;
    heading: string;
    content_text: string;
    category: string;
    created_at: string;
}

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500"
];

function getCategoryColor(category: string) {
    if (!category) return "bg-gray-500";
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
}

interface ClipCardProps {
    clip: Clip;
    onClick: () => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

export function ClipCard({ clip, onClick, onEdit, onDelete }: ClipCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/50 hover:bg-card/60 rounded-xl p-5 cursor-pointer shadow-sm transition-all duration-300 flex flex-col h-56"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm truncate max-w-[120px] uppercase tracking-wide", getCategoryColor(clip.category))}>
                    {clip.category || "Uncategorized"}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{clip.heading}</h3>

            <div className="flex-1 overflow-hidden relative">
                <p className="text-sm text-muted-foreground/90 leading-relaxed break-words whitespace-pre-wrap line-clamp-5 font-normal">
                    {clip.content_text || "No text content"}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/40 to-transparent pointer-events-none" />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground/60 font-medium">
                <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    Click to copy <Clipboard size={12} />
                </span>
            </div>
        </motion.div>
    )
}
