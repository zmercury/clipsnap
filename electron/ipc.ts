import { ipcMain, clipboard, BrowserWindow } from "electron";
import { getClips, addClip, deleteClip, updateClip, getPages, addPage, updatePage, deletePage, togglePinClip, searchClips } from "./db";

export function setupIPC(win: BrowserWindow) {
    // Window Controls
    ipcMain.on("window-minimize", () => {
        win.minimize();
    });

    ipcMain.on("window-maximize", () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    ipcMain.on("window-close", () => {
        win.close();
    });

    // Pages
    ipcMain.removeHandler("db-get-pages");
    ipcMain.handle("db-get-pages", () => {
        return getPages();
    });

    ipcMain.removeHandler("db-add-page");
    ipcMain.handle("db-add-page", (_, { name, icon }) => {
        return addPage(name, icon);
    });

    ipcMain.removeHandler("db-update-page");
    ipcMain.handle("db-update-page", (_, { id, name, icon }) => {
        return updatePage(id, name, icon);
    });

    ipcMain.removeHandler("db-delete-page");
    ipcMain.handle("db-delete-page", (_, id) => {
        return deletePage(id);
    });

    // Clips
    ipcMain.removeHandler("db-get-clips");
    ipcMain.handle("db-get-clips", (_, pageId) => {
        return getClips(pageId);
    });

    ipcMain.removeHandler("db-add-clip");
    ipcMain.handle("db-add-clip", (_, { heading, content_html, content_text, category, pageId, contentType }) => {
        return addClip(heading, content_html, content_text, category, pageId, contentType);
    });

    ipcMain.removeHandler("db-update-clip");
    ipcMain.handle("db-update-clip", (_, { id, heading, content_html, content_text, category }) => {
        return updateClip(id, heading, content_html, content_text, category);
    });

    ipcMain.removeHandler("db-delete-clip");
    ipcMain.handle("db-delete-clip", (_, id) => {
        return deleteClip(id);
    });

    ipcMain.removeHandler("db-toggle-pin");
    ipcMain.handle("db-toggle-pin", (_, id) => {
        return togglePinClip(id);
    });

    ipcMain.removeHandler("db-search-clips");
    ipcMain.handle("db-search-clips", (_, query) => {
        return searchClips(query);
    });

    // Clipboard
    ipcMain.removeHandler("clipboard-read");
    ipcMain.handle("clipboard-read", () => {
        return {
            text: clipboard.readText(),
            html: clipboard.readHTML(),
        };
    });

    ipcMain.removeHandler("clipboard-write");
    ipcMain.handle("clipboard-write", (_, { text, html }) => {
        if (html) {
            clipboard.write({ text, html });
        } else {
            clipboard.writeText(text);
        }
    });
}
