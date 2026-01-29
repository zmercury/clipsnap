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
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="h-full bg-card/20 backdrop-blur-xl border-r border-border/40 overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-4 py-5 border-b border-border/30">
                        <button
                            onClick={onNewPage}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-semibold transition-all border border-primary/30"
                        >
                            <Plus size={16} /> New Page
                        </button>
                    </div>

                    {/* Pages List */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
                        {pages.length > 0 ? (
                            <div className="space-y-1">
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
                            <div className="px-3 py-12 text-center">
                                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Plus size={24} className="text-muted-foreground/40" />
                                </div>
                                <p className="text-xs text-muted-foreground/50 leading-relaxed">No pages yet.<br />Click "New Page" to start.</p>
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
            className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${active
                    ? 'bg-primary/15 text-primary shadow-sm border border-primary/20'
                    : 'text-foreground/70 hover:bg-accent/40 hover:text-foreground border border-transparent'
                }`}
            onClick={onClick}
        >
            <div className="text-xl flex-shrink-0">{page.icon}</div>
            <span className="truncate flex-1">{page.name}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive transition-all"
                title="Delete Page"
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}
