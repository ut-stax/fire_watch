import React from 'react';

export default function ChevronDecoration({ side = 'left', height = 160, color = 'var(--color-primary)' }) {
  const transform = side === 'left' ? 'scaleX(-1)' : 'none';
  const style = {
    width: 48,
    height,
    background: color,
    transform,
    clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)',
  };

  return <div aria-hidden style={style} />;
}
