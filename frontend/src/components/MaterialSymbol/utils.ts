import type { FontDp, FontGrade, FontWeight } from './interface';

interface Param {
  fill?: boolean;
  weight: FontWeight;
  grade: FontGrade;
  dp: FontDp;
}
export const buildFontVariationSettingsStyle = ({
  fill,
  weight,
  grade,
  dp,
}: Param) => {
  let fontVariationSettingsStyle = '';

  if (fill)
    fontVariationSettingsStyle = [fontVariationSettingsStyle, `'FILL' 1`]
      .filter(Boolean)
      .join(', ');
  else
    fontVariationSettingsStyle = [fontVariationSettingsStyle, `'FILL' 0`]
      .filter(Boolean)
      .join(', ');

  if (weight)
    fontVariationSettingsStyle = [
      fontVariationSettingsStyle,
      `'wght' ${weight}`,
    ]
      .filter(Boolean)
      .join(', ');

  if (grade !== undefined)
    fontVariationSettingsStyle = [fontVariationSettingsStyle, `'GRAD' ${grade}`]
      .filter(Boolean)
      .join(', ');

  if (dp) {
    fontVariationSettingsStyle = [fontVariationSettingsStyle, `'opsz' ${dp}`]
      .filter(Boolean)
      .join(', ');
  }

  return fontVariationSettingsStyle;
};
