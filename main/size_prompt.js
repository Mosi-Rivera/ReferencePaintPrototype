const { BrowserWindow, ipcMain } = require("electron");
const path = require('path');
let __resolve, __reject, __prompt_window, __did_submit;

const open = (win) => {
    return (new Promise((resolve, reject) => {
        __resolve = resolve;
        __reject = reject;
        __did_submit = false;
        __prompt_window = new BrowserWindow({
            parent: win,
            show: false,
            width: 300,
            height: 80,
            frame: false,
            modal: true,
            resizable: false,
            fullscreenable: false,
            webPreferences: {
                preload: path.join(__dirname, 'sizePromptPreload.js')
            }
        });
        __prompt_window.once("ready-to-show", () => __prompt_window.show());
        __prompt_window.once("closed", () => {
            if (!__did_submit)
                reject('User canceled prompt.');
            __resolve = null;
            __reject = null;
        });

        __prompt_window.loadFile('./views/size_prompt.html');
    }));
}

const init = () => {
    ipcMain.handle('submit-size-form', (e, size) => {
        if (__resolve && __prompt_window)
        {
            __prompt_window.close();
            __did_submit = true;
            return (__resolve(size));
        }
    });
    ipcMain.handle('cancel-size-form', () => {
        if (__resolve && __prompt_window)
        {
            __prompt_window.close();
            return (__reject('User canceled prompt.'));
        }
    });
}

module.exports = {
    open,
    init
}