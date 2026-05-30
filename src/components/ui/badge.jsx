import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 border-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background",
        secondary:
          "bg-[#0E63B3] text-white border-foreground",
        destructive:
          "bg-[#E2001A] text-white border-foreground",
        outline:
          "text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
