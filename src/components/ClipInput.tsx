import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { motion } from "framer-motion";

export function ClipInput({ onAdd }: { onAdd: (heading: string) => Promise<void> }) {
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!heading.trim()) return;
        setLoading(true);
        try {
            await onAdd(heading);
            setHeading("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-background/95 backdrop-blur-md sticky top-0 z-40 px-8 py-6 border-b border-border shadow-sm">
            <div className="flex gap-4 max-w-3xl mx-auto">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        placeholder="What's on your clipboard?"
                        className="w-full bg-secondary/50 hover:bg-secondary focus:bg-background border border-transparent focus:border-primary/50 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-300 font-medium placeholder:text-muted-foreground/60"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAdd}
                    disabled={loading || !heading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none transition-all duration-300 whitespace-nowrap"
                >
                    <ClipboardPaste size={20} />
                    <span>Paste & Save</span>
                </motion.button>
            </div>
        </div>
    )
}
