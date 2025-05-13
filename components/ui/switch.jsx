import * as React from "react"

const Switch = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      ref={ref}
      className={`relative inline-flex h-6 w-11 items-center rounded-full border border-input bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
      {...props}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`}
      />
    </button>
  )
})
Switch.displayName = "Switch"

export { Switch } 