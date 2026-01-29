import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Layers } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    categories: string[];
    activeFilter: string | null;
    onFilterChange: (category: string | null) => void;
}

const COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500"
];

function getCategoryColor(category: string) {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
}

export function Sidebar({ isOpen, categories, activeFilter, onFilterChange }: SidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="h-full bg-muted/30 border-r border-border/50 overflow-hidden pt-14 flex flex-col backdrop-blur-md"
                >
                    <div className="px-3 py-4 space-y-1">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 pl-3">Library</div>

                        <SidebarItem
                            icon={<Layers size={18} />}
                            label="All Clips"
                            active={activeFilter === null}
                            onClick={() => onFilterChange(null)}
                        />

                        {/* Placeholder for future features */}
                        <SidebarItem icon={<Trash2 size={18} />} label="Trash" onClick={() => { }} />

                        <div className="mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 pl-3">IDs / Tags</div>

                        <div className="space-y-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            {categories.map(cat => (
                                <SidebarItem
                                    key={cat}
                                    icon={<div className={`w-3 h-3 rounded-full ${getCategoryColor(cat)} shadow-sm`} />}
                                    label={cat}
                                    active={activeFilter === cat}
                                    onClick={() => onFilterChange(cat)}
                                />
                            ))}
                            {categories.length === 0 && (
                                <div className="px-3 py-2 text-sm text-muted-foreground italic opacity-60">No tags yet</div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground/80 hover:bg-accent hover:text-foreground'}`}
        >
            {icon}
            <span className="truncate">{label}</span>
        </button>
    )
}
