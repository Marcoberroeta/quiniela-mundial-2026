import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background border-2 border-foreground shadow-[3px_3px_0_#14130f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#14130f] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        destructive:
          "bg-[#E2001A] text-white border-2 border-foreground shadow-[3px_3px_0_#14130f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#14130f]",
        outline:
          "border-2 border-foreground bg-transparent shadow-[3px_3px_0_#14130f] hover:bg-muted hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#14130f] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        secondary:
          "bg-[#0E63B3] text-white border-2 border-foreground shadow-[3px_3px_0_#14130f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#14130f]",
        ghost:
          "hover:bg-muted border-2 border-transparent hover:border-foreground/30",
        link:
          "text-primary underline-offset-4 hover:underline border-0 shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
