const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron');
const path = require('path');
const menuConfig = require('./main/menuConfig');
const data_interface = require('./main/data');
const {init:initSizePrompt} = require('./main/size_prompt');
let win_obj = {win: null};

const throttle = (callback, delay) => {
    let timeout
    return (...args) => {
        if (timeout !== undefined) {
        return
        }

        timeout = setTimeout(() => {
        timeout = undefined
        }, delay)

        return callback(...args)
    }
}

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadFile('index.html');
    return (win);
};

app.whenReady().then(() => {
    win_obj.win = createWindow();
    const {win} = win_obj;
    win.on(
        'resize',
        throttle(() => win.webContents.send('resize',win.getSize()), 200)
    );
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
    ipcMain.handle('dialog', (event, method, params) => dialog[method](params));
    ipcMain.handle('get-window-size', () => win.getSize());
    data_interface.init(ipcMain);
    menuConfig(win);
    initSizePrompt();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});