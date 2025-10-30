'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-line-secondary bg-line-disabled transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-base disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-primary data-[state=checked]:border-transparent',
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className="pointer-events-none block h-5 w-5 translate-x-1 rounded-full bg-primary-foreground shadow transition-transform data-[state=checked]:translate-x-6"
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
