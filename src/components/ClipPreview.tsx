import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Clip {
    id: number;
    heading: string;
    content_text: string;
    category: string;
    created_at: string;
}

interface ClipPreviewProps {
    clip: Clip | null;
    onClose: () => void;
}

export function ClipPreview({ clip, onClose }: ClipPreviewProps) {
    if (!clip) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                    onMouseLeave={onClose}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                        <h2 className="text-lg font-bold text-foreground tracking-tight">{clip.heading}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-accent rounded-md transition-colors"
                        >
                            <X size={18} className="text-muted-foreground" />
                        </button>
                    </div>

                    <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                            {clip.content_text || "No content"}
                        </p>
                    </div>

                    <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="px-2 py-1 bg-muted/50 rounded">{clip.category || "Uncategorized"}</span>
                        <span>{new Date(clip.created_at).toLocaleDateString()}</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
