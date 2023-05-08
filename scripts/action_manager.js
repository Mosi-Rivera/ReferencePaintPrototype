let add_action;
let undo_last_action;

(() => {
    const stack = [];
    undo_last_action = () => stack.length > 0 && stack.pop()();
    add_action = (undo_action) => stack.push(undo_action);
})();