/**
 * @param size Array size
 * @returns 2D Array
 */
function Array2D(size) {
  let arr = [];
  for (let i = 0; i < size; i++) {
    arr[i] = [];
  }
  return arr;
}

/**
 * Mirror 2d Array in the X axis
 */

function Mirror2DX(original) {
  let newArray = Array2D(original.length);
  for (let i = 0; i < original.length; i++) {
    newArray[original.length - 1 - i] = original[i];
  }
  return newArray;
}

/**
 * Mask array
 */

function Mask2D(maskOn, mask) {
  let newArray = maskOn;
  for (let i = 0; i < mask.length; i++) {
    for (let u = 0; u < mask[i].length; u++) {
      if (mask[i][u]) {
        newArray[i][u] = mask[i][u];
      }
    }
  }
  return newArray
}
