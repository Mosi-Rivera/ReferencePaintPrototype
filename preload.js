const {contextBridge, ipcRenderer, BrowserWindow} = require('electron');
(() => {
    contextBridge.exposeInMainWorld('electron', {
        getWindowSize: () => ipcRenderer.invoke('get-window-size'),
        newSheetPrompt: () => ipcRenderer.sendSync('new-sheet-prompt'),
        getData: () => ipcRenderer.invoke('get-all-data'),
        getReference: () => ipcRenderer.invoke('get-reference'),
        getSheet: () => ipcRenderer.invoke('get-sheet'),
        setSheet: (sheet_data) => ipcRenderer.invoke('set-sheet', sheet_data),
        eraseSheetSection: (sx, sy, ex, ey) => ipcRenderer.invoke('erase-sheet-section', [sx, sy, ex, ey]),
        pasteSheetSection: (data, x, y, w, h) => ipcRenderer.invoke('paste-sheet-section', [data, x, y, w, h]),
        findAndRemoveSheetPixels: (positions) => ipcRenderer.invoke('find-and-remove-sheet-pixels', positions),
        exportSheet: (path, dataurl) => ipcRenderer.invoke('export-sheet', [path, dataurl])
    });
    contextBridge.exposeInMainWorld('ipcRenderer', {
        ...ipcRenderer,
        on: ipcRenderer.on.bind(ipcRenderer)
    });
})();