import { motion } from "framer-motion";

interface Clip {
    id: number;
    heading: string;
    content_text: string;
    created_at: string;
}

export function ClipCard({ clip, onClick }: { clip: Clip, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative bg-card hover:bg-accent/40 border-l-4 border-l-transparent hover:border-l-primary border border-border/60 hover:border-border rounded-lg p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{clip.heading}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-light">{clip.content_text || "No text content"}</p>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                    {new Date(clip.created_at).toLocaleString()}
                </div>
            </div>

        </motion.div>
    )
}
