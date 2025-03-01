
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props interface for the SuggestCard component
 * @property {ReactNode} icon - Icon element to display in the card
 * @property {string} title - Main heading text for the card
 * @property {string} subtitle - Secondary text description
 * @property {string} [className] - Optional CSS class name for styling
 */
interface SuggestCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * SuggestCard Component
 * 
 * Displays a suggestion card with an icon, title, and subtitle.
 * Uses a glassmorphism effect and includes hover animations.
 * Maintains a square aspect ratio for consistent layout.
 * 
 * @param {SuggestCardProps} props - Component properties
 * @returns {JSX.Element} - Rendered suggestion card component
 */
export function SuggestCard({ icon, title, subtitle, className }: SuggestCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-[20px] p-6 transition-all duration-300 animate-scale-in",
      "hover:scale-[1.02] cursor-pointer aspect-square flex flex-col",
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Icon container with dark background */}
        <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[14px] bg-sayhalo-dark mb-4">
          {icon}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          {/* Card title */}
          <h3 className="font-bold text-sayhalo-dark text-base mt-1">{title}</h3>
          
          {/* Card subtitle */}
          <p className="text-sayhalo-light text-sm mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
