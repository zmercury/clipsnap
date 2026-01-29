import { motion, AnimatePresence } from "framer-motion";
import { Layers, Hash } from "lucide-react";

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
    if (!category) return "bg-gray-500";
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
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="h-full bg-card/30 backdrop-blur-xl border-r border-border/60 overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-5 py-6 border-b border-border/40">
                        <h2 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
                            <Hash size={16} className="text-primary" />
                            Categories
                        </h2>
                    </div>

                    {/* All Clips */}
                    <div className="px-3 py-3">
                        <SidebarItem
                            icon={<Layers size={18} />}
                            label="All Clips"
                            count={null}
                            active={activeFilter === null}
                            onClick={() => onFilterChange(null)}
                        />
                    </div>

                    {/* Categories List */}
                    <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
                        {categories.length > 0 && (
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <SidebarItem
                                        key={cat}
                                        icon={<div className={`w-3 h-3 rounded-full ${getCategoryColor(cat)} shadow-sm`} />}
                                        label={cat}
                                        count={null}
                                        active={activeFilter === cat}
                                        onClick={() => onFilterChange(cat)}
                                    />
                                ))}
                            </div>
                        )}
                        {categories.length === 0 && (
                            <div className="px-3 py-8 text-center">
                                <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Hash size={20} className="text-muted-foreground/50" />
                                </div>
                                <p className="text-xs text-muted-foreground/60 leading-relaxed">No categories yet.<br />Create a clip to get started.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SidebarItem({ icon, label, count, active = false, onClick }: { icon: any, label: string, count: number | null, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${active
                    ? 'bg-primary/15 text-primary shadow-sm border border-primary/20'
                    : 'text-foreground/70 hover:bg-accent/50 hover:text-foreground border border-transparent'
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className={active ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}>
                    {icon}
                </div>
                <span className="truncate">{label}</span>
            </div>
            {count !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    )
}
