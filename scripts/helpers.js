const RGBAToHexA = (r, g, b, a) => {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    a = a.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    if (a.length == 1)
        a = "0" + a;

    return "#" + r + g + b + a;
}

const resizeCanvasSetup = (canvas, w, h, sw, sh) => {
    let scale; 
    let size;

    size = Math.min(sw / 2 - 30, sh - 250);
    scale = size / Math.max(w, h);
    canvas.pixel_scale = scale;
    canvas.width = canvas.height = size;
    canvas.style.backgroundSize = `${scale * 2}px ${scale * 2}px`;
    canvas.style.backgroundPosition = `0 0, ${scale}px 0, ${scale}px -${scale}px, 0px ${scale}px`;
}