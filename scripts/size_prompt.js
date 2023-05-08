document.getElementById('ok').onclick = () => methods.submit([
    parseInt(document.getElementById('width').value),
    parseInt(document.getElementById('height').value)
]);
document.getElementById('cancel').onclick = () => methods.cancel();