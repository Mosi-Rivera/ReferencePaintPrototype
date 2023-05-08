const Buffer = require('buffer');
const { newPixelData } = require("./PixelData");
const fs = require('fs');

let reference_data;
let sheet_data;

const setSheet = _sheet_data => sheet_data = _sheet_data;

const setReference = _refrence_data => reference_data = _refrence_data;

const getSheet = () => sheet_data;

const getReference = () => reference_data;

const getAll = () => [reference_data, sheet_data];

const exportSheet = async (path, dataurl) => {
    const b64data = dataurl.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(path, b64data, 'base64', err => {
        console.log(err);
    });
}

const init = (ipcMain) => {
    ipcMain.handle('get-all-data', () => getAll());
    ipcMain.handle('get-reference', () => getReference());
    ipcMain.handle('get-sheet', () => getSheet());
    ipcMain.handle('set-sheet', (e, sheet_data) => setSheet(sheet_data));
    ipcMain.handle('erase-sheet-section', (e, data) => eraseSheetSection(...data));
    ipcMain.handle('paste-sheet-section', (e, data) => pasteSheetSection(...data));
    ipcMain.handle('find-and-remove-sheet-pixels', (e, data) => findAndRemoveSheetPixels(data));
    ipcMain.handle('export-sheet', (e, [path, dataurl]) => exportSheet(path, dataurl));
}

module.exports = {
    setSheet,
    setReference,
    getSheet,
    getReference,
    getAll,
    init
};