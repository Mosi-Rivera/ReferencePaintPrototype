const {dialog} = require('electron');
const {setReference} = require('./data');
const newReferenceData = (path) => {
    return ({
        path
    });
}

const loadReference = async (win) => {
    try
    {
        let dialog_data = await dialog['showOpenDialog']({
            title: 'select an image',
            properties: ['openFile'],
            filters: [
                {name: 'Images', extensions: ['jpg', 'png', 'gif']}
            ]
        });
        if (dialog_data.canceled) return;
        const path = dialog_data.filePaths[0];
        win.webContents.send('set-reference-path', [path, ...win.getSize()]);
        setReference(newReferenceData(path));
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports = {
    newReferenceData,
    loadReference
}