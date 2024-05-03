import { classNames } from '../../utils';
import { buildFontVariationSettingsStyle } from './utils';

/**
 * Material symbols
 * @see {@link https://fonts.google.com/icons}
 */
export const MaterialSymbol = (props) => {
  const {
    type = 'rounded',
    icon,
    fill,
    weight = 400,
    grade = 0,
    dp,
    size,
    className: propClassName,
    style: propStyle,
    ...elementProps
  } = props;

  const originalClassName = `material-symbols-${type}`;
  const className = classNames(
    originalClassName,
    `${originalClassName}-${icon}`,
    propClassName
  );

  const style = { ...propStyle };
  if (size) {
    style.fontSize = size;
    // fixed the width and height to prevent the inconsistent style when font is loading
    style.maxWidth = size;
    style.maxHeight = size;
  }

  style.fontVariationSettings = buildFontVariationSettingsStyle({
    fill,
    weight,
    grade,
    dp,
  });

  return (
    <span {...elementProps} className={className} style={style} translate="no">
      {icon}
    </span>
  );
};
