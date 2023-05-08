let getStates;

(() => {
    const numToPixel = (n) => n + 'px';
    const getPixelPosition = (x, y, scale) => [Math.floor(x / scale), Math.floor(y / scale)];
    getStates = () => ({
        idle: {
            mouseenter(canvas)
            {
                const highlight = canvas === reference_canvas ? reference_highlight : sheet_highlight;
                highlight.style.width = canvas.pixel_scale + 'px';
                highlight.style.height = canvas.pixel_scale + 'px';
            },
            mouseleave(canvas)
            {
                const highlight = canvas === reference_canvas ? reference_highlight : sheet_highlight;
                highlight.style.width = 0 + 'px';
                highlight.style.height = 0 + 'px';
            },
            enter()
            {
                let pixel_scale = sheet_canvas.pixel_scale + 'px';
                sheet_highlight.style.width = pixel_scale;
                sheet_highlight.style.height = pixel_scale;
                pixel_scale = reference_canvas.pixel_scale + 'px';
                reference_canvas.style.width = pixel_scale;
                reference_canvas.style.height = pixel_scale;
            },
            mousemove(canvas, e)
            {
                if (canvas === reference_canvas)
                {
                    const pixel_scale = canvas.pixel_scale;
                    const [x, y] = getPixelPosition(e.offsetX, e.offsetY, pixel_scale);
                    reference_highlight.style.left = pixel_scale * x + 'px';
                    reference_highlight.style.top = pixel_scale * y + 'px';
                }
                else
                {
                    const pixel_scale = canvas.pixel_scale;
                    const [x, y] = getPixelPosition(e.offsetX, e.offsetY, pixel_scale);
                    sheet_highlight.style.left = pixel_scale * x + 'px';
                    sheet_highlight.style.top = pixel_scale * y + 'px';
                }
            },
            mousedown(canvas, e)
            {
                const x = Math.floor(e.offsetX / (canvas.pixel_scale || 1)),
                    y = Math.floor(e.offsetY / (canvas.pixel_scale || 1));
                if (canvas === reference_canvas)
                {
                    if (e.button == 0)
                    {

                    }
                    else if (e.button == 2)
                    {
                        return ({state: 'reference_erase', params: [x, y]});
                    }
                }
                else if (canvas === sheet_canvas)
                {
                    if (e.button == 0)
                    {

                    }
                    else if (e.button == 2)
                    {
                        return ({state: 'sheet_erase', params: [x, y]});
                    }
                }
            }
        },
        copy:
        {

        },
        reference_erase: {

        },
        sheet_erase: {
            x: null,
            y: null,
            enter(x,y)
            {
                const pixel_scale = sheet_canvas.pixel_scale;
                this.x = x;
                this.y = y;
                sheet_highlight.style.width = numToPixel(pixel_scale);
                sheet_highlight.style.width = numToPixel(pixel_scale);
                sheet_highlight.style.left  = numToPixel(x);
                sheet_highlight.style.top   = numToPixel(y);
            },
            mouseenter(_, e)
            {
                this.mousemove(null, e);
            },
            mousemove(_, e)
            {
                const pixel_scale = sheet_canvas.pixel_scale;
                let [x, y] = getPixelPosition(e.offsetX, e.offsetY, sheet_canvas.pixel_scale);
                const diffx = x - this.x;
                const diffy = y - this.y;
                sheet_highlight.style.left = diffx < 0 ? (x) : (this.x);
                sheet_highlight.style.left = diffy < 0 ? (y) : (this.y);
                sheet_highlight.style.width = pixel_scale * Math.abs(diffx);
                sheet_highlight.style.height = pixel_scale * Math.abs(diffy);
            },
            mouseleave()
            {
                sheet_highlight.style.width = numToPixel(0);
                sheet_highlight.style.width = numToPixel(0);
            },
            exit()
            {
                this.x = null;
                this.y = null;
            },
            mouseup(canvas, e)
            {
                if (canvas !== sheet_canvas) return {state: 'idle'};
                const sx = this.x,
                    sy = this.y,
                    ex = Math.floor(e.offsetX / (sheet_canvas.pixel_scale || 1)),
                    ey = Math.floor(e.offsetY / (sheet_canvas.pixel_scale || 1));
                    eraseSheetSection(sx, sy, ex, ey);
            }
        }
    });
})();