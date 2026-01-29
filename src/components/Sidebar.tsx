import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

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
    onPageChange: (page: Page) => void;
    onNewPage: () => void;
    onDeletePage: (pageId: number) => void;
}

export function Sidebar({ isOpen, pages, activePage, onPageChange, onNewPage, onDeletePage }: SidebarProps) {
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
                    <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                        {pages.length > 0 ? (
                            <div className="space-y-0.5 px-2">
                                {pages.map(page => (
                                    <PageItem
                                        key={page.id}
                                        page={page}
                                        active={activePage?.id === page.id}
                                        onClick={() => onPageChange(page)}
                                        onDelete={() => onDeletePage(page.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Plus size={18} className="text-muted-foreground/30" />
                                </div>
                                <p className="text-xs text-muted-foreground/40 leading-relaxed">No pages yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function PageItem({ page, active, onClick, onDelete }: { page: Page, active: boolean, onClick: () => void, onDelete: () => void }) {
    return (
        <div
            className={`group relative flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer ${active
                    ? 'bg-primary/5 text-primary border border-primary/10'
                    : 'text-foreground/60 hover:bg-accent/30 hover:text-foreground border border-transparent'
                }`}
            onClick={onClick}
        >
            <div className="text-base flex-shrink-0">{page.icon}</div>
            <span className="truncate flex-1 text-xs">{page.name}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive transition-all"
                title="Delete Page"
            >
                <Trash2 size={12} />
            </button>
        </div>
    )
}
