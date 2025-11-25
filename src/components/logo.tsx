import { cn } from "@/lib/utils";

export function Logo({ className, textClassName }: { className?: string, textClassName?: string }) {
    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary-foreground"
            >
                <path d="M20 6V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v1" />
                <path d="M14.5 10.5 12 8l-2.5 2.5" />
                <path d="M12 8v8" />
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
            </svg>
            </div>
            <span className={cn("font-bold text-xl", textClassName)}>SpeedWatch</span>
        </div>
    )
}
