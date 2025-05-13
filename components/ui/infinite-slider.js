import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export function InfiniteSlider({
  children,
  speed = 40,
  speedOnHover = 20,
  gap = 0,
  className,
}) {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    const sliderWidth = slider.offsetWidth;
    const containerWidth = container.offsetWidth;
    const totalWidth = sliderWidth + gap;

    // Clone the slider content
    const clone = slider.cloneNode(true);
    container.appendChild(clone);

    let animationFrame;
    let currentX = 0;

    const animate = () => {
      currentX -= isHovered.current ? speedOnHover : speed;
      if (currentX <= -totalWidth) {
        currentX = 0;
      }
      container.style.transform = `translateX(${currentX}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [speed, speedOnHover, gap]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="flex"
        style={{ gap: `${gap}px` }}
      >
        <div ref={sliderRef} className="flex" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
} 