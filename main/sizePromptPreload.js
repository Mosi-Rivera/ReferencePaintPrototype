const {contextBridge, ipcRenderer, BrowserWindow} = require('electron');
(() => {
    contextBridge.exposeInMainWorld('methods', {
        submit: (data) => ipcRenderer.invoke('submit-size-form', data),
        cancel: () => ipcRenderer.invoke('cancel-size-form')
    });
})();