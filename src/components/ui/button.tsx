'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-base disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'rounded-none border-b border-line-accent bg-transparent px-0 py-1 text-base text-text-primary hover:bg-background-1',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
        outline: 'border border-line-secondary bg-transparent text-text-primary hover:bg-background-1',
        ghost: 'bg-transparent text-text-primary hover:bg-background-1',
        link: 'bg-transparent text-text-accent underline-offset-4 hover:text-text-primary hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        size: 'default',
        class: 'h-auto px-0 py-1',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
