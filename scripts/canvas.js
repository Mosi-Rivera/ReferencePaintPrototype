
const reference_canvas = document.getElementById("reference-canvas");
const sheet_canvas = document.getElementById("sheet-canvas");
const reference_ctx = reference_canvas.getContext('2d');
const sheet_ctx = sheet_canvas.getContext('2d');
const reference_highlight = document.getElementById('reference-highlight');
const sheet_highlight = document.getElementById('sheet-highlight');

(() => {
    const states = getStates();
    let active_state = 'idle';
    console.log(states);
    const getActiveState = () => states[active_state];
    const setState = (data) => {
        let state = getActiveState();
        if (data && states[data.state])
        {
            data.params = data.params || {};
            if (state.exit)
                state.exit();
            active_state = data.state;
            state = getActiveState();
            if (state.enter)
                state.enter(...data.params);
        }
    }
    reference_canvas.addEventListener('mousedown', (e) => {
        let state = getActiveState();
        if (state.mousedown)
            setState(state.mousedown(reference_canvas, e));
    });
    reference_canvas.addEventListener('mouseup', (e) => {
        const state = getActiveState();
        if (state.mouseup)
            setState(state.mouseup(reference_canvas, e));
    });
    reference_canvas.addEventListener('mousemove', (e) => {
        const state = getActiveState();
        if (state.mousemove)
            setState(state.mousemove(reference_canvas, e));
    });
    reference_canvas.addEventListener("mouseenter", (e) => {
        const state = getActiveState();
        console.log('enter reference');
        if (state.mouseenter)
            setState(state.mouseenter(reference_canvas, e));
    });
    reference_canvas.addEventListener("mouseleave", (e) => {
        const state = getActiveState();
        console.log('leave reference');
        if (state.mouseleave)
            setState(state.mouseleave(reference_canvas, e));
    });
    sheet_canvas.addEventListener('mousedown', (e) => {
        let state = getActiveState();
        if (state.mousedown)
            setState(state.mousedown(sheet_canvas, e));
    });
    sheet_canvas.addEventListener('mouseup', (e) => {
        const state = getActiveState();
        if (state.mouseup)
            setState(state.mouseup(sheet_canvas, e));
    });
    sheet_canvas.addEventListener('mousemove', (e) => {
        const state = getActiveState();
        if (state.mousemove)
            setState(state.mousemove(sheet_canvas, e));
    });
    sheet_canvas.addEventListener("mouseenter", (e) => {
        const state = getActiveState();
        console.log('enter sheet');
        if (state.mouseenter)
            setState(state.mouseenter(sheet_canvas, e));
    });
    sheet_canvas.addEventListener("mouseleave", (e) => {
        const state = getActiveState();
        console.log('leave sheet');
        if (state.mouseleave)
            setState(state.mouseleave(sheet_canvas, e));
    });
})();