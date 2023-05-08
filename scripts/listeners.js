(() => {
    const name_input = document.getElementById('sheet-name');
    ipcRenderer.on("new-reference", (e, {reference_data, width, height}) => {
        resizeReference(reference_data, width, height);
        if (G_SHEET_DATA)
            addFrameSheetsToDom(G_SHEET_DATA);
    });
    ipcRenderer.on("new-sheet", (e, {sheet_data, width, height}) => {
        G_SHEET_DATA = sheet_data;
        resizeSheet(sheet_data, width, height);
        name_input.disabled = false;
        name_input.value = sheet_data.sheet_name;
    });
    ipcRenderer.on("load-sheet", (e, {sheet_data, path}) => loadSheetData(sheet_data, path));
    ipcRenderer.on('set-sheet', (e, sheet_data) => {
        G_SHEET_DATA = sheet_data;
        addFrameSheetsToDom(sheet_data);
        drawSheetData(sheet_data);
    });
    ipcRenderer.on("draw-reference", (e, reference_data) => drawReference(reference_img));
    ipcRenderer.on("draw-sheet", (e, sheet_data) => drawSheetData(sheet_data));
    ipcRenderer.on("set-reference-path", (e, path) => setImageFromPath(path));
    ipcRenderer.on("export-sheet", async (e, path) => {
        if (!G_SHEET_DATA) return;
        const canvas = createSpritesheet(G_SHEET_DATA);
        try
        {
            const dataurl = canvas.toDataURL('image/jpg');
            electron.exportSheet(path, dataurl);
        }
        catch(err)
        {
            console.log(err);
        }
    });
})();