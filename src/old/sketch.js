/** TODO
 * - Improve eye brows algo
 */

// config
const pixelPerWidth = 10;
const pixelGrid = Array2d(pixelPerWidth*2);

// variables
let ps;
function setup() {
  const canvaSize = min(windowWidth / 1.5, windowHeight / 1.5);
  createCanvas(canvaSize, canvaSize);
  noLoop();
  background("#fff");
  colorMode(HSB);

  // variables
  ps = width / pixelPerWidth; // pixel size
  strokeWeight(0);
}
function draw() {
  drawBg();
  eyes();
  mouth();
  drawGrid();
}

function eyes() {
  // 50% chance to have mirrored eyes
  const isMir = random() < 0.5;

  // eyes position
  const x = 1;
  const y = 2;
  const rightX = 5;

  const outColor = "white";
  const pupilColor = NoiseColor(1, 5, "complementary");

  const startX = round(random(0, 2));
  const startY = round(random(0, 2));

  const maxX = 3;
  const maxY = 3;

  const W = round(random(1, maxX - startX));
  const H = round(random(1, maxY - startY));

  // pupil
  const pX = round(random(startX, startX + W - 1));
  const pY = round(random(startY, startY + H - 1));

  for (let i = 0; i < H; i++) {
    for (let u = 0; u < W; u++) {
      pixelGrid[x + startX + u][y + startY + i] = outColor; // left eye
      if (isMir) {
        pixelGrid[rightX + maxX - 1 - startX - u][y + startY + i] = outColor; // mirrored right eye
      } else {
        pixelGrid[rightX + startX + u][y + startY + i] = outColor; // right eye
      }
    }
  }
  pixelGrid[x + pX][y + pY] = pupilColor; // left eye
  if (isMir) {
    pixelGrid[rightX + maxX - 1 - pX][y + pY] = pupilColor; // mirrored right eye
  } else {
    pixelGrid[rightX + pX][y + pY] = pupilColor; // right eye
  }

  // Eye brows
  const bColor = "black";
  const bX = round(random(0, 3));
  let bY = round(random(1, 2));
  const bS = round(random(3, 4 - bX));

  // if eye brow over pupil move eye brow up
  if (y + pY == bY) {
    bY--;
  }

  // 100% chance eye brow fit perfectly
  const fP = random() > 0;
  // left eye brow
  for (let j = 0; j < bS; j++) {
    if (fP) {
      pixelGrid[x + startX + j][bY] = bColor;
      pixelGrid[pixelPerWidth - 1 + x - startX - j][bY] = bColor;
    } else {
      pixelGrid[j][bY] = bColor;
      pixelGrid[pixelPerWidth - 1 - j][bY] = bColor;
    }
  }
}

function mouth() {
  const H = 3;
  const W = 4;

  const x = 2;
  const y = round(random(5, 8));

  const red = Tone(color("#ff0019"), random(0, 15));
  const black = Tone("#0d0d0d", random(0, 15));

  for (let i = 0; i < H; i++) {
    for (let u = 0; u < W; u++) {
      pixelGrid[x + u][y + i] = black;
    }
  }

  pixelGrid[x + 1][7] = red;
  pixelGrid[x + 2][7] = red;
}

// draw functions

function drawGrid() {
  pixelGrid.forEach((va, vi) => {
    va.forEach((ha, hi) => {
      if (ha) {
        fill(ha);
        rect(vi * ps, hi * ps, ps, ps);
      }
    });
  });
}

function drawBg() {
  for (let i = 0; i < pixelPerWidth; i++) {
    for (let u = 0; u < pixelPerWidth; u++) {
      fill(
        NoiseColor(
          (random() > 0.5 ? i * pixelPerWidth + u : u * pixelPerWidth + i) /
            random(300, 450),
          100
        )
      );
      rect(i * ps, u * ps, ps, ps);
    }
  }
}

// utils
function Array2d(rows) {
  var arr = [];

  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }

  return arr;
}
// color funcs
function NoiseColor(t, l = 5, k) {
  const c = color(
    360 * noise(t + 10 + l),
    360 * noise(t + 10 + l * 2),
    360 * noise(t + 10 + l * 3)
  );
  if (k == "complementary") {
    return color((hue(c) + 180) % 360, saturation(c), brightness(c));
  }

  return c;
}

function NoiseFromColor(base, x) {
  return color(
    (hue(base) + 360 * noise(0 + x)) % 360,
    saturation(base),
    brightness(base)
  );
}

function Tone(base, x = 15) {
  // x from 1 to 15
  return color(hue(base), map(x, 0, 14, saturation(base), 0), brightness(base));
}
