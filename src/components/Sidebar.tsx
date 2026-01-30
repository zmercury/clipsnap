import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Hash } from "lucide-react";

interface Page {
    id: number;
    name: string;
    icon: string;
    created_at: string;
}

interface SidebarProps {
    isOpen: boolean;
    pages: Page[];
    activePage: Page | null;
    categories: string[];
    activeFilter: string | null;
    onPageChange: (page: Page) => void;
    onNewPage: () => void;
    onEditPage: (page: Page) => void;
    onDeletePage: (pageId: number) => void;
    onFilterChange: (category: string | null) => void;
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

export function Sidebar({ isOpen, pages, activePage, categories, activeFilter, onPageChange, onNewPage, onEditPage, onDeletePage, onFilterChange }: SidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="h-full bg-card/60 backdrop-blur-xl border-r border-border/30 overflow-hidden flex flex-col"
                >
                    {/* Pages Section */}
                    <div className="flex-shrink-0">
                        {/* Header with icon-only new page button */}
                        <div className="px-3 py-3 border-b border-border/20 flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Pages</h2>
                            <button
                                onClick={onNewPage}
                                className="p-1.5 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-md transition-all"
                                title="New Page"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Pages List */}
                        <div className="max-h-[40vh] overflow-y-auto py-2 custom-scrollbar">
                            {pages.length > 0 ? (
                                <div className="space-y-0.5 px-2">
                                    {pages.map(page => (
                                        <PageItem
                                            key={page.id}
                                            page={page}
                                            active={activePage?.id === page.id}
                                            onClick={() => onPageChange(page)}
                                            onEdit={() => onEditPage(page)}
                                            onDelete={() => onDeletePage(page.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center">
                                    <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Plus size={18} className="text-muted-foreground/30" />
                                    </div>
                                    <p className="text-xs text-muted-foreground/40 leading-relaxed">No pages yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categories Section */}
                    {activePage && (
                        <div className="flex-1 flex flex-col border-t border-border/20 overflow-hidden">
                            <div className="px-3 py-3 flex items-center gap-2">
                                <Hash size={14} className="text-muted-foreground" />
                                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar">
                                {categories.length > 0 ? (
                                    <div className="space-y-0.5">
                                        <CategoryItem
                                            label="All"
                                            active={activeFilter === null}
                                            onClick={() => onFilterChange(null)}
                                        />
                                        {categories.map(cat => (
                                            <CategoryItem
                                                key={cat}
                                                label={cat}
                                                color={getCategoryColor(cat)}
                                                active={activeFilter === cat}
                                                onClick={() => onFilterChange(cat)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-3 py-8 text-center">
                                        <div className="w-10 h-10 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Hash size={16} className="text-muted-foreground/30" />
                                        </div>
                                        <p className="text-xs text-muted-foreground/40 leading-relaxed">No tags yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

import { Pencil, Trash2, Hash, Plus } from "lucide-react";

// ... existing code ...

function PageItem({ page, active, onClick, onEdit, onDelete }: { page: Page, active: boolean, onClick: () => void, onEdit: () => void, onDelete: () => void }) {
    return (
        <div
            className={`group relative flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer ${active
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-foreground/60 hover:bg-accent/30 hover:text-foreground border border-transparent'
                }`}
            onClick={onClick}
        >
            <div className="text-base flex-shrink-0">{page.icon}</div>
            <span className="truncate flex-1 text-xs">{page.name}</span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-all"
                    title="Edit Page"
                >
                    <Pencil size={11} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all"
                    title="Delete Page"
                >
                    <Trash2 size={11} />
                </button>
            </div>
        </div>
    )
}

function CategoryItem({ label, color, active, onClick }: { label: string, color?: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${active
                ? 'bg-primary/5 text-primary border border-primary/10'
                : 'text-foreground/60 hover:bg-accent/30 hover:text-foreground border border-transparent'
                }`}
        >
            {color && <div className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} />}
            <span className="truncate flex-1 text-left">{label}</span>
        </button>
    )
}
