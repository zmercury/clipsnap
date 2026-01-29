import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', {
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
  },
  db: {
    getClips: () => ipcRenderer.invoke('db-get-clips'),
    addClip: (clip: { heading: string, content_html: string, content_text: string, category: string }) => ipcRenderer.invoke('db-add-clip', clip),
    updateClip: (clip: { id: number, heading: string, content_html: string, content_text: string, category: string }) => ipcRenderer.invoke('db-update-clip', clip),
    deleteClip: (id: number) => ipcRenderer.invoke('db-delete-clip', id),
  },
  clipboard: {
    read: () => ipcRenderer.invoke('clipboard-read'),
    write: (content: { text: string, html?: string }) => ipcRenderer.invoke('clipboard-write', content),
  }
})
