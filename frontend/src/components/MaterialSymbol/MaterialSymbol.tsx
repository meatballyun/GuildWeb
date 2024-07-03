import React from 'react';
import { classNames } from '../../utils';
import { FontDp, FontGrade, FontType, FontWeight } from './interface';
import { buildFontVariationSettingsStyle } from './utils';

interface MaterialSymbolProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon: string;
  size?: number;
  fill?: boolean;
  type?: FontType;
  weight?: FontWeight;
  grade?: FontGrade;
  dp?: FontDp;
}

/**
 * Material symbols
 * @see {@link https://fonts.google.com/icons}
 */
export const MaterialSymbol = (props: MaterialSymbolProps) => {
  const {
    type = 'rounded',
    icon,
    fill,
    weight = 400,
    grade = 0,
    dp = 24,
    size = 24,
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
