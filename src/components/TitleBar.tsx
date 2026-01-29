import { X, Minus, Square, PanelLeft } from "lucide-react";

export function TitleBar({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <div className="h-10 bg-background/80 backdrop-blur-md flex items-center justify-between px-3 select-none border-b border-border fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-3 drag-region w-full h-full">
                <button onClick={toggleSidebar} className="no-drag p-1.5 hover:bg-accent text-foreground/70 hover:text-foreground rounded-md transition-colors">
                    <PanelLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-foreground/80 tracking-tight">ClipSnap</span>
            </div>
            <div className="flex items-center gap-1 no-drag">
                <button onClick={() => window.api.window.minimize()} className="p-2 hover:bg-accent text-foreground/70 hover:text-foreground rounded-md transition-colors">
                    <Minus size={16} />
                </button>
                <button onClick={() => window.api.window.maximize()} className="p-2 hover:bg-accent text-foreground/70 hover:text-foreground rounded-md transition-colors">
                    <Square size={14} />
                </button>
                <button onClick={() => window.api.window.close()} className="p-2 hover:bg-destructive hover:text-destructive-foreground text-foreground/70 rounded-md transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
