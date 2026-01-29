import { useEffect, useState, useMemo } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { ClipCard } from './components/ClipCard'
import { ClipFormModal } from './components/ClipFormModal'
import { ThemeProvider } from './components/ThemeProvider'
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

interface Clip {
  id: number;
  heading: string;
  content_html: string;
  content_text: string;
  category: string;
  created_at: string;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [clips, setClips] = useState<Clip[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);

  useEffect(() => {
    loadClips()
  }, [])

  const loadClips = async () => {
    const data = await window.api.db.getClips()
    setClips(data)
  }

  const categories = useMemo(() => {
    const cats = new Set(clips.map(c => c.category).filter(Boolean));
    return Array.from(cats);
  }, [clips]);

  const filteredClips = useMemo(() => {
    if (!activeFilter) return clips;
    return clips.filter(c => c.category === activeFilter);
  }, [clips, activeFilter]);

  const handleSaveClip = async (data: { id?: number, heading: string, content: string, category: string }) => {
    try {
      if (data.id) {
        // Update
        // For now, we only support text content update from modal. HTML content remains if not changed, or we treat plain text as source.
        const original = clips.find(c => c.id === data.id);
        await window.api.db.updateClip({
          id: data.id,
          heading: data.heading,
          content_text: data.content,
          content_html: original?.content_html || "", // TODO: Handle HTML updates if needed
          category: data.category
        });
      } else {
        // Create
        // Try to see if clipboard has HTML if user pasted verbatim? 
        // For simplicity manual entry is text, but we could check clipboard if it matches.
        // For now, simple text entry.
        await window.api.db.addClip({
          heading: data.heading,
          content_text: data.content,
          content_html: "",
          category: data.category
        });
      }
      await loadClips();
      setEditingClip(null);
    } catch (error) {
      console.error("Failed to save clip", error)
    }
  }

  const handleDeleteClip = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this clip?")) {
      await window.api.db.deleteClip(id);
      await loadClips();
    }
  }

  const handleCopyClip = async (clip: Clip) => {
    try {
      await window.api.clipboard.write({
        text: clip.content_text,
        html: clip.content_html
      })
      toast.success("Copied to clipboard!", {
        description: clip.heading,
        duration: 2000,
        position: 'bottom-center'
      });
    } catch (error) {
      console.error("Failed to copy clip", error)
      toast.error("Failed to copy clip");
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background/80 text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      {/* Mica-like background layer */}
      <div className="fixed inset-0 -z-10 bg-background/30 backdrop-blur-3xl" />

      <TitleBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden pt-10">
        <Sidebar
          isOpen={sidebarOpen}
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="p-6 overflow-y-auto h-full scroll-smooth">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Dashboard
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setEditingClip(null); setIsModalOpen(true); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                >
                  <Plus size={18} /> New Clip
                </motion.button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${activeFilter === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                      }`}
                  >
                    {activeFilter !== cat && <div className={`w-2 h-2 rounded-full ${getCategoryColor(cat)}`} />}
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                {filteredClips.map(clip => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onClick={() => handleCopyClip(clip)}
                    onEdit={(e: React.MouseEvent) => { e.stopPropagation(); setEditingClip(clip); setIsModalOpen(true); }}
                    onDelete={(e: React.MouseEvent) => handleDeleteClip(e, clip.id)}
                  />
                ))}

                {filteredClips.length === 0 && (
                  <div className="col-span-full text-center py-20 text-muted-foreground flex flex-col items-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl grayscale opacity-50">👻</span>
                    </div>
                    <p className="text-lg font-medium">No clips found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ClipFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClip}
        initialData={editingClip ? {
          id: editingClip.id,
          heading: editingClip.heading,
          content: editingClip.content_text,
          category: editingClip.category
        } : undefined}
      />
      <Toaster theme="system" closeButton richColors />
    </div>
  )
}

function getCategoryColor(category: string) {
  // Shared color logic, ideally move to a util
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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="clipsnap-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
