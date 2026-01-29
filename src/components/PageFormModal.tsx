import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";

interface PageFormData {
    id?: number;
    name: string;
    icon: string;
}

interface PageFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PageFormData) => Promise<void>;
    initialData?: PageFormData;
}

const EMOJI_SUGGESTIONS = ['📝', '💼', '💡', '📚', '🎯', '🔥', '⭐', '🚀', '💻', '🎨', '📊', '🎵', '🏠', '✈️', '🎮', '📱'];

export function PageFormModal({ isOpen, onClose, onSave, initialData }: PageFormModalProps) {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("📄");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setIcon(initialData.icon);
            } else {
                setName("");
                setIcon("📄");
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                id: initialData?.id,
                name,
                icon
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-semibold tracking-tight">
                                {initialData ? "Edit Page" : "New Page"}
                            </h2>
                            <button onClick={onClose} className="p-1 hover:bg-accent rounded-md transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Page Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border/50 focus:border-primary/50 focus:bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Work, Personal, Ideas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Icon</label>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-4xl">{icon}</div>
                                    <input
                                        type="text"
                                        value={icon}
                                        onChange={e => setIcon(e.target.value)}
                                        className="flex-1 bg-secondary/50 border border-border/50 focus:border-primary/50 focus:bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Enter emoji"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_SUGGESTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setIcon(emoji)}
                                            className={`text-2xl p-2 rounded-lg transition-all ${icon === emoji
                                                    ? 'bg-primary/20 ring-2 ring-primary/50'
                                                    : 'bg-muted/30 hover:bg-muted/50'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                                >
                                    <Save size={16} /> Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
