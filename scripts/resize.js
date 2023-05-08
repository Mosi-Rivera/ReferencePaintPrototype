const resizeReference = (ref_img, w, h) => {
    if (!ref_img)
        resizeCanvasSetup(reference_canvas, 4, 4, w, h);
    else
    {
        resizeCanvasSetup(reference_canvas, ref_img.naturalWidth, ref_img.naturalHeight, w, h);
        drawReference(ref_img);
    }
}

const resizeSheet = (sheet_data, w, h) => {
    if (!sheet_data)
        resizeCanvasSetup(sheet_canvas, 4, 4, w, h);
    else
    {
        resizeCanvasSetup(sheet_canvas, sheet_data.width, sheet_data.height, w, h);
        drawSheetData(sheet_data);
    }
}

(() => {
    const resize = (width, height) => {
        resizeReference(reference_img ,width, height);
        resizeSheet(G_SHEET_DATA, width, height);
    }
    ipcRenderer.on("resize", (e, [width, height]) => resize(width, height));
    electron.getWindowSize()
    .then(([width, height]) => resize(width, height))
    .catch(err => console.log(err));
})();