
import { Hand } from "lucide-react";

interface SayHaloLogoProps {
  size?: number;
  className?: string;
}

export function SayHaloLogo({ size = 40, className = "" }: SayHaloLogoProps) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-sayhalo-dark ${className}`} style={{ width: size, height: size }}>
      <Hand size={size * 0.5} className="text-white" />
    </div>
  );
}
