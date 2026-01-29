import { ipcMain, clipboard, BrowserWindow } from "electron";
import { getClips, addClip, deleteClip, updateClip } from "./db";

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

    // Database
    ipcMain.removeHandler("db-get-clips");
    ipcMain.handle("db-get-clips", () => {
        return getClips();
    });

    ipcMain.removeHandler("db-add-clip");
    ipcMain.handle("db-add-clip", (_, { heading, content_html, content_text, category }) => {
        return addClip(heading, content_html, content_text, category);
    });

    ipcMain.removeHandler("db-update-clip");
    ipcMain.handle("db-update-clip", (_, { id, heading, content_html, content_text, category }) => {
        return updateClip(id, heading, content_html, content_text, category);
    });

    ipcMain.removeHandler("db-delete-clip");
    ipcMain.handle("db-delete-clip", (_, id) => {
        return deleteClip(id);
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
