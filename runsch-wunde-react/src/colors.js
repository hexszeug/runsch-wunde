import ColorThief from 'colorthief/dist/color-thief.mjs';

const LIGHT_LIGHTNESS = 65;

const colorThief = new ColorThief();

export const extractColor = (image) => colorThief.getColor(image);

export const extractColorForBackground = (image) => {
  const color = extractColor(image);
  return lightnessOf(color) >= LIGHT_LIGHTNESS
    ? color
    : enlightened(color, LIGHT_LIGHTNESS);
};

const lightnessOf = (color) =>
  Math.round((Math.min(...color) + Math.max(...color)) * (100 / (2 * 255)));

const enlightened = (color, targetLighness) => {
  const oldLightness = lightnessOf(color);
  if (targetLighness <= oldLightness) return color;
  const difference = targetLighness - oldLightness;
  const increase = difference / (100 - oldLightness);
  const lightColor = color.map((v) => v + increase * (255 - v));
  return lightColor;
};
