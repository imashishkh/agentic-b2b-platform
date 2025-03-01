
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SuggestCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function SuggestCard({ icon, title, subtitle, className }: SuggestCardProps) {
  return (
    <div className={cn(
      "glass-card rounded-[15px] p-[15px] transition-all duration-300 animate-scale-in",
      "hover:scale-[1.02] cursor-pointer",
      className
    )}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-sayhalo-dark">
          {icon}
        </div>
        <h3 className="font-bold text-sayhalo-dark text-sm mt-1">{title}</h3>
        <p className="text-sayhalo-light text-xs">{subtitle}</p>
      </div>
    </div>
  );
}
