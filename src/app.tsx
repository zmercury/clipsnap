import { useEffect, useState, useMemo } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { ClipCard } from './components/ClipCard'
import { ClipFormModal } from './components/ClipFormModal'
import { ThemeProvider } from './components/ThemeProvider'
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

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
    } catch (error) {
      console.error("Failed to copy clip", error)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background/90 text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      {/* Mica-like background layer */}
      <div className="fixed inset-0 -z-10 bg-background/50 backdrop-blur-3xl" />

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
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  {activeFilter ? <span className="flex items-center gap-2"><span className="opacity-50 font-normal">Category /</span> {activeFilter}</span> : "Dashboard"}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setEditingClip(null); setIsModalOpen(true); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                >
                  <Plus size={18} /> New Clip
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
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
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="clipsnap-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
