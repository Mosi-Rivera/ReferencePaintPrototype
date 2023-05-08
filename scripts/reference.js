const reference_name = document.getElementById('reference-name');
let reference_img;
let reference_img_data;

const setImageFromPath = ([path, sw, sh]) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            reference_img = img;
            reference_ctx.drawImage(img, 0, 0);
            reference_img_data = reference_ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
            resizeReference(img, sw, sh);
            const split_path = path.split('\\');
            reference_name.innerHTML = split_path[split_path.length  - 1];
            resolve();
        }
        img.onerror = () => reject(err);
    });
}