import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: number;
  isMatch?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "drawn" | "game" | "input";
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-xl",
};

export function LotteryBall({ 
  number, 
  isMatch = false, 
  size = "md",
  variant = "game" 
}: LotteryBallProps) {
  const baseClasses = cn(
    "rounded-full flex items-center justify-center font-mono font-bold transition-all duration-300",
    sizeClasses[size]
  );

  if (variant === "drawn") {
    return (
      <div className={cn(baseClasses, "lottery-ball animate-float")} style={{ animationDelay: `${number * 0.1}s` }}>
        {number.toString().padStart(2, "0")}
      </div>
    );
  }

  if (isMatch) {
    return (
      <div className={cn(baseClasses, "lottery-ball-match")}>
        {number.toString().padStart(2, "0")}
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, "lottery-ball-input")}>
      {number.toString().padStart(2, "0")}
    </div>
  );
}
