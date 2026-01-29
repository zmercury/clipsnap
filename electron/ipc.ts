import { ipcMain, clipboard, BrowserWindow } from "electron";
import { getClips, addClip, deleteClip } from "./db";

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
    ipcMain.handle("db-get-clips", () => {
        return getClips();
    });

    ipcMain.handle("db-add-clip", (_, { heading, content_html, content_text }) => {
        return addClip(heading, content_html, content_text);
    });

    ipcMain.handle("db-delete-clip", (_, id) => {
        return deleteClip(id);
    });

    // Clipboard
    ipcMain.handle("clipboard-read", () => {
        return {
            text: clipboard.readText(),
            html: clipboard.readHTML(),
        };
    });

    ipcMain.handle("clipboard-write", (_, { text, html }) => {
        if (html) {
            clipboard.write({ text, html });
        } else {
            clipboard.writeText(text);
        }
    });
}
