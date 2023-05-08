const {Menu} = require('electron');
const {loadReference} = require('./reference');
const { newSheet, loadSheet, saveSheet, exportSheet } = require('./sheet');
module.exports = (win) => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Load Reference',
                    click: () => loadReference(win).catch(err => console.log(err))
                },
                {
                    label: 'Load Sheet',
                    click: () => loadSheet(win)
                },
                {
                    label: 'New Sheet',
                    click: () => newSheet(win)
                },
                {
                    label: 'Save Sheet',
                    click: () => saveSheet(win)
                },
            ]
        },
        {
            label: 'Export',
            submenu: [
                {
                    role: 'Export Sheet',
                    click: () => exportSheet(win)
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    role: 'toggledevtools'
                }
            ] 
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}