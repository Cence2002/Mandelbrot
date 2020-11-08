let canvas, gui;
let params = {
    center_x: -0.7439074445034225,
    center_y: -0.13171198533161682,
    zoom_log: 5,
    iter: 100,
    save: () => saveCanvas('frame-' + nf(frameCount, 6) + '.png')
};

function setupGUI() {
    gui = new dat.GUI({autoPlace: false, width: 250});
    document.body.appendChild(gui.domElement);
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.left = canvas.x + canvas.width - gui.width + 'px';
    gui.domElement.style.top = canvas.y + 'px';
    gui.closed = true;

    gui.add(params, 'center_x', 0.000000001).name('Center x').onChange(() => draw_mandelbrot());
    gui.add(params, 'center_y', 0.000000001).name('Center y').onChange(() => draw_mandelbrot());
    gui.add(params, 'zoom_log', 5, 22, 0.01).name('Zoom').onChange(() => draw_mandelbrot());
    gui.add(params, 'iter', 300, 3000, 100).name('Iterations').onChange(() => draw_mandelbrot());

    gui.add(params, 'save').name('Save canvas');
    gui.updateDisplay();
}

//////////////////////////////////////////////////


function iterCount(cx, cy, iter) {
    let x = 0, y = 0, i;
    for (i = 0; i < iter && x * x + y * y <= 4; i++) {
        let nx = x * x - y * y + cx;
        let ny = 2 * x * y + cy;
        x = nx;
        y = ny;
    }
    return i;
}

function mandelbrot_pixels(x, y, zoom, iter) {
    let dens = pixelDensity();
    loadPixels();
    for (let xi = 0; xi < width * dens; xi++) {
        for (let yi = 0; yi < height * dens; yi++) {
            let i = 4 * (yi * width * dens + xi);
            let cx = map(xi, 0, width * dens, x - width / zoom / 2, x + width / zoom / 2);
            let cy = map(yi, 0, height * dens, y - height / zoom / 2, y + height / zoom / 2);
            let n = 1 - log(iterCount(cx, cy, iter)) / log(iter);
            if (n === 1) {
                pixels[i] = 0;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
            } else {
                pixels[i] = 0;
                pixels[i + 1] = 256 * (1 - n);
                pixels[i + 2] = 256 * (1 - n);
            }
        }
    }
    updatePixels();
}

function draw_mandelbrot() {
    mandelbrot_pixels(params.center_x, params.center_y, exp(params.zoom_log), params.iter);
    gui.updateDisplay();
}

function setup() {
    canvas = createCanvas(800, 500);
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);
    colorMode(RGB, 1);
    pixelDensity(0.5);
    background(0);
    setupGUI();
    draw_mandelbrot();
}

function draw() {
    draw_mandelbrot();
}

function doubleClicked() {
    let zoom = exp(params.zoom_log);
    let x = params.center_x, y = params.center_y;
    params.center_x = map(mouseX, 0, width, x - width / zoom / 2, x + width / zoom / 2);
    params.center_y = map(mouseY, 0, height, y - height / zoom / 2, y + height / zoom / 2);
    params.zoom_log++;
    draw_mandelbrot();
    gui.updateDisplay();
}

function mousePressed() {
    clog(123);
}

function clog(object) {
    console.log(object);
}
