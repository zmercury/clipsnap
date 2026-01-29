import { useEffect, useState } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { ClipInput } from './components/ClipInput'
import { ClipCard } from './components/ClipCard'

interface Clip {
  id: number;
  heading: string;
  content_html: string;
  content_text: string;
  created_at: string;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [clips, setClips] = useState<Clip[]>([])

  useEffect(() => {
    loadClips()
  }, [])

  const loadClips = async () => {
    const data = await window.api.db.getClips()
    setClips(data)
  }

  const handleAddClip = async (heading: string) => {
    try {
      const content = await window.api.clipboard.read()
      await window.api.db.addClip({
        heading,
        content_html: content.html,
        content_text: content.text
      })
      await loadClips()
    } catch (error) {
      console.error("Failed to add clip", error)
    }
  }

  const handleCopyClip = async (clip: Clip) => {
    try {
      await window.api.clipboard.write({
        text: clip.content_text,
        html: clip.content_html
      })
      // Optional: Visual feedback could be added here
    } catch (error) {
      console.error("Failed to copy clip", error)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20 selection:text-primary">
      <TitleBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex overflow-hidden pt-10">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 flex flex-col min-w-0 bg-secondary/10 relative">
          <ClipInput onAdd={handleAddClip} />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 pb-20">
              {clips.map(clip => (
                <ClipCard key={clip.id} clip={clip} onClick={() => handleCopyClip(clip)} />
              ))}

              {clips.length === 0 && (
                <div className="text-center py-32 text-muted-foreground flex flex-col items-center animate-in fade-in duration-700">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">📋</span>
                  </div>
                  <p className="text-xl font-semibold">No clips yet</p>
                  <p className="text-sm mt-2 opacity-60 max-w-xs">Copy something interesting and paste it using the box above to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
