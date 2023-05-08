let G_SHEET_DATA;

const newPixelData = (x, y, light, a) => {
    return ({
        x,
        y,
        light,
        a
    })
}

const parseImgData = (img, width, height) => {
    const result = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let px, py;
    let image_data;
    let index;
    ctx.drawImage(img, 0, 0);
    for (let h = 0, hl = Math.floor(img.naturalHeight / height); h < hl; h++)
    {
        for (let w = 0, wl = Math.floor(img.naturalWidth / width); w < wl; w++)
        {
            const sheet = [];
            image_data = ctx.getImageData(w * width, h * height, width, height).data;
            for (let y = 0; y < height; y++)
            {
                for (let x = 0; x < width; x++)
                {
                    index = y * width * 4 + x * 4;
                    px = image_data[index];
                    py = image_data[index + 1];
                    sheet.push(newPixelData(
                        px,
                        py,
                        image_data[index + 2],
                        image_data[index + 3]
                    ));
                }
            }
            result.push(sheet);
        }
    }
    return (result);
}

const loadSheetData = (sheet_data, path) => {
    return (new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            sheet_data.data = parseImgData(img, sheet_data.width, sheet_data.height);
            G_SHEET_DATA = sheet_data;
            addFrameSheetsToDom(sheet_data);
            electron.setSheet(sheet_data)
            .then(() => resolve())
            .catch(err => reject(err));
            return (resolve());
        };
        img.onerror = err => {
            return reject(err);
        }
    }))
}

const createSpritesheet = (sheet_data) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = sheet_data.data;
    const width = sheet_data.width;
    const height = sheet_data.height;
    let sheet;
    let pixel_data;
    canvas.width = data.length * width;
    canvas.height = height;
    for (let i = 0, l = data.length; i < l; i++)
    {
        sheet = data[i];
        console.log(i);
        for (let y = 0, yl = height; y < yl; y++)
        {
            for (let x = 0, xl = width; x < xl; x++)
            {
                pixel_data = sheet[y * width + x];
                if (pixel_data.x === -1) continue;
                ctx.fillStyle = `rgba(${pixel_data.x}, ${pixel_data.y}, ${pixel_data.light}, ${pixel_data.a})`;
                console.log(ctx.fillStyle);
                ctx.fillRect(i * width + x, y, 1, 1);
            }
        }
    }
    console.log('done creating sheet');
    return (canvas);
}

const sheetDataStringify = sheet_data => {
    const data = {
        width: sheet_data.width,
        height: sheet_data.height,
        name: sheet_data.project_name,
        url: createSpritesheet(sheet_data).toDataURL()
    }
    return (JSON.stringify(data));
}

const sheetDataParse = async data => {
    try {
        data = JSON.parse(data);
        const sheet_data = newSheetData(data);
        await loadSheetData(sheet_data);
        return (sheet_data);
    }
    catch(err)
    {
        console.log(err);
    }
}

const createSheetClickSelectFunction = (index) => () => {
    if (G_SHEET_DATA)
    {
        const sheet_frame_container = document.getElementById('c-sheet-frames');
        sheet_frame_container.children[G_SHEET_DATA.index].classList.remove('selected');
        G_SHEET_DATA.index = index;
        sheet_frame_container.children[G_SHEET_DATA.index].classList.add('selected');
        drawSheetData(G_SHEET_DATA);
    }
}

const addFrameSheetsToDom = (sheet_data) => {
    const sheets = sheet_data.data;
    const sheet_frame_container = document.getElementById('c-sheet-frames');
    while (sheet_frame_container.firstChild)
        sheet_frame_container.removeChild(sheet_frame_container.firstChild);
    const canvas_size = 120;
    console.log('before loop');
    console.log(sheets);
    for (let i = 0, l = sheets.length; i < l; i++)
    {
        const container = document.createElement('div');
        const canvas = document.createElement('canvas');
        canvas.width = canvas_size;
        canvas.height = canvas_size;
        canvas.pixel_scale = canvas_size / Math.min(sheet_data.width, sheet_data.height);
        console.log(canvas.pixel_scale, sheet_data.data[i]);
        const name = document.createElement('span');
        name.innerHTML = 'frame ' + (i + 1);
        const ctx = canvas.getContext('2d');
        drawSheetData(sheet_data, canvas, ctx, i);
        container.append(canvas, name);
        container.onclick = createSheetClickSelectFunction(i);
        sheet_frame_container.append(container);
    }
    console.log('after loop');
}

const createModifySheetSectionUndoFunc = (sx, sy, w, h, modified) => () => {
    pasteSheetSection(modified, sx, sy, w, h);
}

const eraseSheetSection = (sx, sy, ex, ey) => {
    if (!sheet_data) return;
    const sheet = sheet_data.data[sheet_data.index];
    if (!sheet) return;
    const width = sheet_data.width;
    const removed = [];
    for (let y = sy, ly = Math.min(sheet_data.height, ey + 1); y < ly; y++)
    {
        for (let x = sx, xl = Math.min(sheet_data.width, ex + 1); x < xl; x++)
        {
            removed.push(sheet[y * width + x]);
            sheet[y * width + x] = newPixelData(-1, 0, 0, 0);
        }
    }
    createModifySheetSectionUndoFunc(sx, sy, ex - sx, ey - sy, removed);
}

const pasteSheetSection = (data, sx, sy, w, h, no_undo) => {
    if (!sheet_data) return;
    const sheet = sheet_data.data[sheet_data.index];
    if (!sheet) return;
    const width = sheet_data.width;
    const modified = [];
    for (let iy = 0; iy < h; iy++)
    {
        for (let ix = 0; ix < w; ix++)
        {
            const index = (sy * iy) * width + (sx + ix);
            modified.push(sheet[index]);
            sheet[index] = data[iy * w + ix];
        }
    }
    if (!no_undo)
        createModifySheetSectionUndoFunc(sx, sy, ex - sx, ey - sy, removed);
}

const findAndRemoveSheetPixels = positions => {
    if (!sheet_data) return;
    const sheet = sheet_data.data[sheet_data.index];
    if (!sheet) return;
    const width = sheet_data.width;
    const modified = [];
    for (let i = 0, l = width * sheet.height; i < l; i++)
    {
        const pixel = sheet[index];
        for (let p = 0, pl = positions.length; p < pl; p++)
        {
            const pos = positions[p];
            if (pixel.x == pos[0] && pixel.y == pos[1])
            {
                modified.push(pixel);
                sheet[index] = newPixelData(-1, 0, 0, 0);
            }
        }
    }
    return (modified);
}