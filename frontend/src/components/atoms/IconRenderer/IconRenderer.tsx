import React from 'react';

import { type IconType } from '@interfaces/types';

interface IconRendererProps {
  icon: IconType;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  size = 32,
  className = '',
  style = {},
  alt = "icon"
}) => {
  if (typeof icon === 'string') {
    const imageStyle: React.CSSProperties & { WebkitUserDrag?: string } = {
      objectFit: 'contain',
      imageRendering: 'pixelated',
      userSelect: 'none',
      WebkitUserDrag: 'none',
      ...style
    };

    return (
      <img
        src={icon}
        alt={alt}
        width={size}
        height={size}
        className={className}
        draggable={false}
        style={imageStyle}
      />
    );
  }

  const IconComponent = icon as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

  return (
    <IconComponent
      size={size}
      className={className}
      style={style}
    />
  );
};