function NoiseColor(t, b = 255) {
  return color(
    `rgba(${100 * noise(t + 10)}%, ${100 * noise(t + 15)}%, ${
      100 * noise(t + 20)
    }%, ${b})`
  );
}

function NoiseFromColor(base, t, h = 100) {
  return color(
    (hue(base) + map(noise(100 + t), 0, 1, -h, h)) % 360,
    saturation(base),
    brightness(base)
  );
}

function ComplimentColor(c) {
  return color((hue(c) + 180) % 360, saturation(c), brightness(c));
}

function InverseColor(c) {
  return color(
    `rgb(${255 - round(red(c))}, ${255 - round(green(c))}, ${
      255 - round(blue(c))
    })`
  );
}
