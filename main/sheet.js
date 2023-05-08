const {dialog} = require('electron');
const {newPixelData} = require('./PixelData');
const {open:openSizePrompt} = require('./size_prompt');
const {setSheet, getSheet} = require('./data');
const fsp = require('fs/promises');
const fs = require('fs');
const newSheetData = (data, fill) => {
    const result = {
        width: data.width,
        height: data.height,
        sheet_name: data.name,
        path: data.path,
        index: 0,
        data: []
    };
    if (fill)
    {
        const sheet = [];
        for (let i = 0, l = data.width * data.height; i < l; i++)
            sheet.push(newPixelData(-1, 0, 0, 0));
            result.data.push(sheet);
    }
    return (result);
}

const getActiveSheetPixelData = (sheet_data, x, y) => {
    if (sheet_data.data.length == 0) return;
    return (sheet_data.data[sheet_data.index][y * sheet_data.width + x]);
}

const loadSheet = async win => {
    try
    {
        let dialog_data = await dialog['showOpenDialog']({
            title: 'select an image',
            properties: ['openFile'],
            filters: [
                {name: 'Images', extensions: ['jpg', 'png', 'gif','rpsd']}
            ]
        });
        if (dialog_data.canceled) return;
        const path = dialog_data.filePaths[0];
        const extension = path.split('.').pop();
        if (extension === 'rpsd')
        {
            const text = await fsp.readFile(path, 'utf8');
            const data = JSON.parse(text);
            setSheet(data);
            win.webContents.send('set-sheet', data);
        }
        else
        {
            const res = await openSizePrompt(win);
            let [width, height] = res;
            const sheet_data = newSheetData({
                width,
                height,
                name: 'new_project'
            }, true);
            win.webContents.send('load-sheet', {sheet_data, path});
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

const newSheet = async (win) => {
    try
    {
        const res = await openSizePrompt(win);
        let [width, height] = res;
        const sheet_data = newSheetData({
            width,
            height,
            name: 'new_project'
        }, true);
        [width, height] = win.getSize();
        setSheet(sheet_data);
        win.webContents.send("new-sheet", {sheet_data, width, height});
    }
    catch(err)
    {
        console.log(err);
    }
}

const saveSheet = async () => {
    try
    {
        let path;
        const sheet_data = getSheet();
        if (!sheet_data) return;
        if (!sheet_data.path)
        {
            let dialog_data = await dialog.showSaveDialog({
                title: 'select an image',
                filters: [
                    {name: 'Custom File Type', extensions: ['rpsd']},
                ]
            });
            if (dialog_data.canceled) return;
            path = dialog_data.filePath;
            sheet_data.path = path;
        }
        else
            path = sheet_data.path;
        var writeStream = fs.createWriteStream(path);
        writeStream.write(JSON.stringify(sheet_data));
        writeStream.end();
    }
    catch(err)
    {
        console.log(err);
    }
}

const exportSheet = async win => {
    try
    {
        let dialog_data = await dialog.showSaveDialog({
            title: 'Export Spritesheet',
            filters: [
                {name: 'Image', extensions: ['png', 'jpg']},
            ]
        });
        if (dialog_data.canceled) return;
        const path = dialog_data.filePath;
        win.webContents.send('export-sheet', path);
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports = {
    newSheetData,
    getActiveSheetPixelData,
    newSheet,
    loadSheet,
    saveSheet,
    exportSheet
}