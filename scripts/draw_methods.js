const drawReference = img => {
    const pixel_scale = reference_canvas.pixel_scale || 1;
    reference_ctx.imageSmoothingEnabled = false;
    reference_ctx.drawImage(img, 0, 0, img.naturalWidth * pixel_scale, img.naturalHeight * pixel_scale);
}

const drawSheetData = (sheet_data, canvas = sheet_canvas, ctx = sheet_ctx, index = null) => {
    index = index != null ? index : sheet_data.index;
    if (!reference_img || !reference_img_data) return;
    const sheet = sheet_data.data[index];
    const width = sheet_data.width;
    const height = sheet_data.height;
    let pixel_data;
    const ref_width = reference_img.naturalWidth;
    const sheet_pixel_scale = canvas.pixel_scale || 1;
    const reference_pixel_Scale = reference_canvas.pixel_scale || 1;
    let color_index;
    let reference_img_data_data = reference_img_data.data;
    for (let y = 0, yl = height; y < yl; y++)
    {
        for (let x = 0, xl = width; x < xl; x++)
        {
            pixel_data = sheet[y * width + x];
            if (pixel_data.x == -1) continue;
            color_index = pixel_data.y * ref_width * 4 + pixel_data.x * 4;
            if (!color_index) continue;
            ctx.fillStyle = `rgba(${reference_img_data_data[color_index]}, ${reference_img_data_data[color_index + 1]}, ${reference_img_data_data[color_index + 2]}, ${reference_img_data_data[color_index + 3]})`;
            ctx.fillRect(x * sheet_pixel_scale, y * sheet_pixel_scale, sheet_pixel_scale, sheet_pixel_scale);
        }
    }
}