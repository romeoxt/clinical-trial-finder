import { cn } from '../../lib/utils';

export function ProgressiveBlur({
  className,
  direction = 'left',
  blurIntensity = 1,
}) {
  return (
    <div
      className={cn(
        'absolute inset-y-0 w-20 pointer-events-none',
        direction === 'left' ? 'left-0' : 'right-0',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(${
          direction === 'left' ? 'to right' : 'to left'
        }, transparent, hsl(var(--background)) ${blurIntensity * 100}%)`,
      }}
    />
  );
} 