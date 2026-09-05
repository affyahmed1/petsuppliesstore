import type { CSSProperties } from 'react';
import type { CropSide } from '../types';

interface ProductImageProps {
  image: string;
  crop: CropSide;
  alt: string;
  className?: string; // wrapper (supplies aspect ratio)
  imgClassName?: string; // img (transitions, hover scale)
  eager?: boolean;
}

/**
 * Renders campaign plates. Duo plates hold two products side by side;
 * the left/right crops isolate each half without stretching, whatever
 * the plate's native aspect ratio.
 */
export default function ProductImage({
  image,
  crop,
  alt,
  className = '',
  imgClassName = '',
  eager = false,
}: ProductImageProps) {
  const sideStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: crop === 'left' ? 'left center' : 'right center',
  };

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
          className={imgClassName}
          style={sideStyle}
        />
      )}
    </div>
  );
}
