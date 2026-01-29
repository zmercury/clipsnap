import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', {
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
  },
  db: {
    getPages: () => ipcRenderer.invoke('db-get-pages'),
    addPage: (page: { name: string, icon: string }) => ipcRenderer.invoke('db-add-page', page),
    updatePage: (page: { id: number, name: string, icon: string }) => ipcRenderer.invoke('db-update-page', page),
    deletePage: (id: number) => ipcRenderer.invoke('db-delete-page', id),
    getClips: (pageId?: number) => ipcRenderer.invoke('db-get-clips', pageId),
    addClip: (clip: { heading: string, content_html: string, content_text: string, category: string, pageId: number }) => ipcRenderer.invoke('db-add-clip', clip),
    updateClip: (clip: { id: number, heading: string, content_html: string, content_text: string, category: string }) => ipcRenderer.invoke('db-update-clip', clip),
    deleteClip: (id: number) => ipcRenderer.invoke('db-delete-clip', id),
  },
  clipboard: {
    read: () => ipcRenderer.invoke('clipboard-read'),
    write: (content: { text: string, html?: string }) => ipcRenderer.invoke('clipboard-write', content),
  }
})
