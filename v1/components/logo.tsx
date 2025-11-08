import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({ className, width = 120, height = 40, priority = false }: LogoProps) {
  return (
    <div
      className={cn("relative flex items-center", className)}
      style={{ width: width, height: height, minWidth: width, minHeight: height }}
    >
      {/* Light theme logo */}
      <Image
        src="/logo-light.png"
        alt="App Logo"
        fill
        priority={priority}
        className="logo-light object-contain w-full h-full"
        sizes={`(max-width: 600px) 80vw, ${width}px`}
      />
      {/* Dark theme logo */}
      <Image
        src="/logo-dark.png"
        alt="App Logo"
        fill
        priority={priority}
        className="logo-dark object-contain w-full h-full"
        sizes={`(max-width: 600px) 80vw, ${width}px`}
      />
    </div>
  );
}

export function LogoIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn("relative flex items-center", className)}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {/* Light theme logo icon */}
      <Image
        src="/logo-light.png"
        alt="App Icon"
        fill
        className="logo-light object-contain rounded w-full h-full"
        sizes={`${size}px`}
      />
      {/* Dark theme logo icon */}
      <Image
        src="/logo-dark.png"
        alt="App Icon"
        fill
        className="logo-dark object-contain rounded w-full h-full"
        sizes={`${size}px`}
      />
    </div>
  );
}