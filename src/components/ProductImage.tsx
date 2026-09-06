import type { CSSProperties } from 'react';
import type { CropSide } from '../types';

interface ProductImageProps {
  image: string;
  crop: CropSide;
  alt: string;
  className?: string; // wrapper
  imgClassName?: string; // img (transitions, hover scale)
  eager?: boolean;
}

/**
 * Renders campaign plates. Duo plates (2:1) are cropped to a
 * clean left/right half; the wrapper supplies the aspect ratio.
 */
export default function ProductImage({
  image,
  crop,
  alt,
  className = '',
  imgClassName = '',
  eager = false,
}: ProductImageProps) {
  const side: CSSProperties =
    crop === 'left' ? { left: 0 } : crop === 'right' ? { right: 0 } : {};

  return (
    <div className={`relative overflow-hidden bg-linen ${className}`}>
      {crop === 'full' ? (
        <img
          src={image}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <img
          src={image}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className={`absolute top-0 h-full w-auto max-w-none min-w-[200%] ${imgClassName}`}
          style={side}
        />
      )}
    </div>
  );
}
