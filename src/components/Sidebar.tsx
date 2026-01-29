import { motion, AnimatePresence } from "framer-motion";
import { Copy, Star, Clock, Trash2 } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="h-full bg-muted/40 border-r border-border overflow-hidden pt-14 flex flex-col backdrop-blur-sm"
                >
                    <div className="px-4 py-2 space-y-1">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 pl-2">Library</div>
                        <SidebarItem icon={<Clock size={18} />} label="Recent" active />
                        <SidebarItem icon={<Star size={18} />} label="Favorites" />
                        <SidebarItem icon={<Copy size={18} />} label="All Clips" />
                        <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function SidebarItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
            {icon}
            <span>{label}</span>
        </button>
    )
}
