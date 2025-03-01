
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
      "glass-card rounded-[20px] p-6 transition-all duration-300 animate-scale-in",
      "hover:scale-[1.02] cursor-pointer aspect-square flex flex-col",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[14px] bg-sayhalo-dark mb-4">
          {icon}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <h3 className="font-bold text-sayhalo-dark text-base mt-1">{title}</h3>
          <p className="text-sayhalo-light text-sm mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
