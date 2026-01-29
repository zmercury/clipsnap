import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, ClipboardPaste } from "lucide-react";

interface ClipFormData {
    id?: number;
    heading: string;
    content: string;
    category: string;
}

interface ClipFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClipFormData) => Promise<void>;
    initialData?: ClipFormData;
}

export function ClipFormModal({ isOpen, onClose, onSave, initialData }: ClipFormModalProps) {
    const [heading, setHeading] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setHeading(initialData.heading);
                setContent(initialData.content);
                setCategory(initialData.category);
            } else {
                setHeading("");
                setContent("");
                setCategory("");
            }
        }
    }, [isOpen, initialData]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setContent(text);
        } catch (err) {
            console.error("Failed to read clipboard", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                id: initialData?.id,
                heading,
                content,
                category: category.trim() || "Uncategorized"
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
                        className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-semibold tracking-tight">
                                {initialData ? "Edit Clip" : "New Clip"}
                            </h2>
                            <button onClick={onClose} className="p-1 hover:bg-accent rounded-md transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Heading</label>
                                <input
                                    type="text"
                                    required
                                    value={heading}
                                    onChange={e => setHeading(e.target.value)}
                                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Enter a heading..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Category / ID</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="e.g. Work, Ideas, Code"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-muted-foreground">Content</label>
                                    <button
                                        type="button"
                                        onClick={handlePaste}
                                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <ClipboardPaste size={12} /> Paste Clipboard
                                    </button>
                                </div>
                                <textarea
                                    required
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full h-32 bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    placeholder="Paste or type content here..."
                                />
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
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg flex items-center gap-2 shadow-sm transition-all"
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
