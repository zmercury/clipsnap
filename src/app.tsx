import { useEffect, useState, useMemo } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { ClipCard } from './components/ClipCard'
import { ClipFormModal } from './components/ClipFormModal'
import { PageFormModal } from './components/PageFormModal'
import { ThemeProvider } from './components/ThemeProvider'
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

interface Page {
  id: number;
  name: string;
  icon: string;
  created_at: string;
}

interface Clip {
  id: number;
  heading: string;
  content_html: string;
  content_text: string;
  category: string;
  page_id: number;
  created_at: string;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [pages, setPages] = useState<Page[]>([])
  const [activePage, setActivePage] = useState<Page | null>(null)
  const [clips, setClips] = useState<Clip[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingClip, setEditingClip] = useState<Clip | null>(null);

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    if (activePage) {
      loadClips(activePage.id)
    }
  }, [activePage])

  const loadPages = async () => {
    const data = await window.api.db.getPages()
    setPages(data)
    if (data.length > 0 && !activePage) {
      setActivePage(data[0])
    }
  }

  const loadClips = async (pageId: number) => {
    const data = await window.api.db.getClips(pageId)
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

  const handleSavePage = async (data: { id?: number, name: string, icon: string }) => {
    try {
      if (data.id) {
        await window.api.db.updatePage({ id: data.id, name: data.name, icon: data.icon });
      } else {
        await window.api.db.addPage({ name: data.name, icon: data.icon });
        await loadPages();
        // Set the newly created page as active
        const newPages = await window.api.db.getPages();
        const newPage = newPages.find(p => p.name === data.name);
        if (newPage) setActivePage(newPage);
      }
      await loadPages();
    } catch (error) {
      console.error("Failed to save page", error)
      toast.error("Failed to save page");
    }
  }

  const handleDeletePage = async (pageId: number) => {
    if (pages.length === 1) {
      toast.error("Cannot delete the last page");
      return;
    }
    if (confirm("Delete this page and all its clips?")) {
      await window.api.db.deletePage(pageId);
      await loadPages();
      // Switch to first available page
      const remainingPages = pages.filter(p => p.id !== pageId);
      if (remainingPages.length > 0) {
        setActivePage(remainingPages[0]);
      }
    }
  }

  const handleSaveClip = async (data: { id?: number, heading: string, content: string, category: string }) => {
    if (!activePage) return;

    try {
      if (data.id) {
        const original = clips.find(c => c.id === data.id);
        await window.api.db.updateClip({
          id: data.id,
          heading: data.heading,
          content_text: data.content,
          content_html: original?.content_html || "",
          category: data.category
        });
      } else {
        await window.api.db.addClip({
          heading: data.heading,
          content_text: data.content,
          content_html: "",
          category: data.category,
          pageId: activePage.id
        });
      }
      await loadClips(activePage.id);
      setEditingClip(null);
    } catch (error) {
      console.error("Failed to save clip", error)
      toast.error("Failed to save clip");
    }
  }

  const handleDeleteClip = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm("Delete this clip?")) {
      await window.api.db.deleteClip(id);
      if (activePage) await loadClips(activePage.id);
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
        position: 'bottom-right'
      });
    } catch (error) {
      console.error("Failed to copy clip", error)
      toast.error("Failed to copy clip");
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background/60 backdrop-blur-2xl text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <TitleBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden pt-10">
        <Sidebar
          isOpen={sidebarOpen}
          pages={pages}
          activePage={activePage}
          onPageChange={setActivePage}
          onNewPage={() => setIsPageModalOpen(true)}
          onDeletePage={handleDeletePage}
        />

        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="p-6 overflow-y-auto h-full scroll-smooth">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <span className="text-4xl">{activePage?.icon}</span>
                  {activePage?.name || "No Page"}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setEditingClip(null); setIsClipModalOpen(true); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                  disabled={!activePage}
                >
                  <Plus size={18} /> New Clip
                </motion.button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === null
                    ? "bg-primary text-primary-foreground shadow-sm border border-primary/30"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60 hover:border-border"
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${activeFilter === cat
                      ? "bg-primary text-primary-foreground shadow-sm border border-primary/30"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60 hover:border-border"
                      }`}
                  >
                    {activeFilter !== cat && <div className={`w-2 h-2 rounded-full ${getCategoryColor(cat)}`} />}
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 pb-20">
                {filteredClips.map(clip => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    onClick={() => handleCopyClip(clip)}
                    onEdit={(e: React.MouseEvent) => { e.stopPropagation(); setEditingClip(clip); setIsClipModalOpen(true); }}
                    onDelete={(e: React.MouseEvent) => handleDeleteClip(e, clip.id)}
                  />
                ))}

                {filteredClips.length === 0 && (
                  <div className="col-span-full text-center py-20 text-muted-foreground flex flex-col items-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl grayscale opacity-50">📋</span>
                    </div>
                    <p className="text-lg font-medium">No clips yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">Click "New Clip" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ClipFormModal
        isOpen={isClipModalOpen}
        onClose={() => setIsClipModalOpen(false)}
        onSave={handleSaveClip}
        existingCategories={categories}
        initialData={editingClip ? {
          id: editingClip.id,
          heading: editingClip.heading,
          content: editingClip.content_text,
          category: editingClip.category
        } : undefined}
      />

      <PageFormModal
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSave={handleSavePage}
      />

      <Toaster theme="system" closeButton richColors />
    </div>
  )
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

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="clipsnap-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
