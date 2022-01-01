/**
 *  Configs
 */
let resolution = 10; // how many pixel per width and height
let bgColor = [31, 34, 87]; // background color

/**
 *  Global variables
 */
let grid, // grid to draw
  pixel,
  padding; // size of one pixel

/**
 *  Initiate the Grid stuff
 *
 *  @notice our grid start from 1
 */
function initGrid(edges) {
  padding = 80;
  /**
   * Create our empty pixel grid into a 2D array
   */
  grid = Array2D(resolution);
  pixel = ceil((width - padding * 2) / resolution);
  if (!edges) {
    noStroke();
  }
}

/**
 *  Draw the grid in Real Time
 */
function updateGrid() {
  grid.forEach((x, i) => {
    x.forEach((y, u) => {
      if (y) {
        fill(y);
        rect(padding + i * pixel, padding + u * pixel, pixel, pixel);
      }
    });
  });
}

function setup() {
  const canvaSize = min(windowWidth / 1.2, windowHeight / 1.2);
  createCanvas(canvaSize, canvaSize);
  noLoop();
  frameRate(1);
  colorMode(HSB);
  background("white");
}

function draw() {
  initGrid(false);
  face();
  const eyes = new Eyes();
  eyes.update();
  const mouth = new Mouth();
  mouth.update();
  updateGrid();
}

/**
 *  Actual drawing
 */

function face() {
  // vars
  // chances
  let humanColor = random([
    "#ffceb4",
    "#e1ac96",
    "#b48a78",
    "#87675a",
    "#3c2e28",
  ]);
  let isNotHuman = random() > 0.7; // chance to have human skin

  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      const uniqueXY = random() > 0.5 ? x * resolution + y : y * resolution + x;
      if (isNotHuman) {
        grid[x][y] = NoiseColor(uniqueXY / 200);
      } else {
        grid[x][y] = NoiseFromColor(humanColor, uniqueXY / r(50, 100), 50);
      }
    }
  }
}

class Mouth {
  // Allowed drawing area
  startX = round(resolution / 2) - round(resolution / 4) - 1;
  startY = resolution - round(resolution / 4);
  endX = resolution - this.startX - 1;
  endY = resolution - 1;
  // Mouth grid
  g = Array2D(resolution);

  constructor() {
    this.bg();
  }
  bg() {
    let startX = r(0, this.endX - 2);
    let endX = r(startX + 1, this.endX);
    let startY = r(0, 2);
    let endY = r(startY + 1, 3);

    for (let i = startX; i < endX; i++) {
      for (let u = startY; u < endY; u++) {
        this.g[this.startX + i][this.startY + u] = "black";
      }
    }

    // tongue
    let tongueStart = r(startX + 1, endX - 1);
    let tongueEnd = r(tongueStart, endX - 1);

    for (let i = tongueStart; i < tongueEnd; i++) {
      for (let u = startY; u < endY; u++) {
        this.g[this.startX + i][this.startY + u] = "pink";
      }
    }
  }
  update() {
    grid = Mask2D(grid, this.g);
  }
}

class Eyes {
  // Allowed drawing area
  startX = 0;
  startY = 1;
  endX = round(resolution / 2) - 2;
  endY = round(resolution / 1.6);
  // Eye grid
  g = Array2D(resolution);

  // Colors
  eyeBrowColor = "#101010";
  whiteColor = "white";
  pupilColor = "red";

  constructor() {
    let hasEyebrows = random() > 0.1; // chance to have eyebrows
    if (hasEyebrows) {
      this.brows();
    } else {
      this.eyebrowY = 0;
    }

    this.eyes();
  }
  // brows
  brows() {
    // Configs
    let start = r(0, this.endX - 1); // start
    let end = r(start + 2, this.endX + 1); // end
    let width = end - start;
    let marginY = 0;

    // chances
    let isTick = width > 2 && random() < 0.3; // chance for double tick
    let isWeird = width > 2 && random() < 0.7; // chance for weird eyebrows
    let isUni = width > 2 && random() < 0.7; // chance for uni brow
    for (let i = start; i < end; i++) {
      if (isTick) {
        this.g[this.startX + i][this.startY + marginY + 1] = this.eyeBrowColor;
      }
      if (isWeird) {
        if (i == start || (i == end - 1 && !isUni)) {
          this.g[this.startX + i][this.startY + marginY + r(-1, 1)] =
            this.eyeBrowColor;
        }
      }
      if (isUni) {
        if (i == start || i == end - 1) {
          this.g[this.startX + i + 1][this.startY + marginY] =
            this.eyeBrowColor;
        }
      }
      this.g[this.startX + i][this.startY + marginY] = this.eyeBrowColor;
    }

    this.eyebrowY = this.startY + marginY;
  }
  // Eyes
  eyes() {
    // Configs
    let startY = r(this.eyebrowY, this.endY - 2); // start Y
    let endY = r(startY + 1, this.endY); // end Y

    let startX = r(0, this.endX); // start X
    let endX = r(startX + 1, this.endX + 1); // end X

    const height = endY - startY;
    const width = endX - startX;

    // eyes white
    for (let i = startX; i < endX; i++) {
      for (let u = startY; u < endY; u++) {
        this.g[this.startX + i][this.startY + u] = this.whiteColor;
      }
    }

    // eye pupil
    let pupilX = r(startX, endX - 1);
    let pupilY = r(startY, endY - 1);

    // chances
    let noPupil = width < 3 && random() > 0.9;
    let isLongPupil =
      !noPupil && height > 1 && (width > 1 || height != 2) && random() > 0.8;
    let isWidePupil = !noPupil && width > 1 && random() > 0.8;

    if (!noPupil) {
      this.g[this.startX + pupilX][this.startY + pupilY] = this.pupilColor;
    }

    if (isLongPupil) {
      this.g[this.startX + pupilX][
        this.startY + pupilY + (pupilY == endY - 1 ? -1 : 1)
      ] = this.pupilColor;
    }

    if (isWidePupil) {
      this.g[this.startX + pupilX + (pupilX == endX - 1 ? -1 : 1)][
        this.startY + pupilY
      ] = this.pupilColor;
      if (isLongPupil) {
        this.g[this.startX + pupilX + (pupilX == endX - 1 ? -1 : 1)][
          this.startY + pupilY + (pupilY == endY - 1 ? -1 : 1)
        ] = this.pupilColor;
      }
    }
  }

  // draw eyes into the grid
  update() {
    grid = Mask2D(grid, this.g);

    let isMirrored = random() > 0.5; // chance for mirror or copy
    if (isMirrored) {
      grid = Mask2D(grid, Mirror2DX(this.g));
    } else {
      //  if not mirrored copy it then to the left side
      grid = Mask2D(grid, Push2DX(this.g, resolution / 2));
    }
  }
}
