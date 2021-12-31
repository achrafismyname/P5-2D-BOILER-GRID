/**
 *  Configs
 */
let resolution = 10; // how many pixel per width and height
const bgColor = "white"; // background color

/**
 *  Global variables
 */
let grid, // grid to draw
  pixel; // size of one pixel

/**
 *  Initiate the Grid stuff
 *
 *  @notice our grid start from 1
 */
function initGrid(edges) {
  /**
   * Create our empty pixel grid into a 2D array
   */
  grid = Array2D(resolution);
  pixel = ceil(width / resolution);
  if (!edges) {
    noStroke();
  }

  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      grid[x][y] = bgColor;
    }
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
        rect(i * pixel, u * pixel, pixel, pixel);
      }
    });
  });
}

function setup() {
  const canvaSize = min(windowWidth / 1.5, windowHeight / 1.5);
  createCanvas(canvaSize, canvaSize);
  noLoop();
  colorMode(HSB);

  initGrid(true);
}

function draw() {
  const eyes = new Eyes();
  eyes.update();
  updateGrid();
}

/**
 *  Actual drawing
 */
class Eyes {
  // Allowed drawing area
  startX = 1;
  startY = 2;
  endX = round(resolution / 2) - 1;
  endY = round(resolution / 1.6);
  // Eye grid
  g = Array2D(resolution);
  constructor() {
    this.leftEye();
  }
  // leftEye
  leftEye() {
    this.g[this.startX + 4][this.startY + 2] = "cyan";
  }
  // draw eyes into the grid
  update() {
    console.log(this.g);
    grid = Mask2D(grid, this.g);

    grid[this.startX][this.startY] = "yellow";
    grid[this.endX][this.endY] = "blue";
  }
}
