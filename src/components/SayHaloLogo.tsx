
import { Hand } from "lucide-react";

/**
 * Props interface for the SayHaloLogo component
 * @property {number} [size] - Optional size of the logo in pixels
 * @property {string} [className] - Optional CSS class name for styling
 */
interface SayHaloLogoProps {
  size?: number;
  className?: string;
}

/**
 * SayHaloLogo Component
 * 
 * Displays the SayHalo brand logo - a circular dark background with a white hand icon.
 * The size is customizable via props.
 * 
 * @param {SayHaloLogoProps} props - Component properties
 * @returns {JSX.Element} - Rendered logo component
 */
export function SayHaloLogo({ size = 40, className = "" }: SayHaloLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-sayhalo-dark ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Hand icon from Lucide React, sized proportionally to the container */}
      <Hand size={size * 0.5} className="text-white" />
    </div>
  );
}
