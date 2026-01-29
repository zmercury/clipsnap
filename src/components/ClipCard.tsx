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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className="group relative bg-card/60 backdrop-blur-sm border border-border/60 hover:border-primary/50 rounded-xl p-4 cursor-pointer shadow-sm transition-all duration-300 flex flex-col h-48"
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm truncate max-w-[120px]", getCategoryColor(clip.category))}>
                    {clip.category || "Uncategorized"}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-primary transition-colors"
                        title="Edit"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-background/80 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="text-base font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{clip.heading}</h3>

            <div className="flex-1 overflow-hidden relative">
                <p className="text-xs text-muted-foreground/80 leading-relaxed break-words whitespace-pre-wrap line-clamp-4 font-light">
                    {clip.content_text || "No text content"}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/60 to-transparent pointer-events-none" />
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground/50 font-medium">
                <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                    Click to copy <Clipboard size={10} />
                </span>
            </div>
        </motion.div>
    )
}
