import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex sm:h-10 h-8 w-full rounded-md border border-input bg-background px-3 py-1 sm:text-sm text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 mb-2',
  {
    variants: {
      variant: {
        default: '',
        underline:
          'border-b-2 border-t-0 border-x-0 rounded-none focus:border-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  minLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, minLength, variant, onChange, ...props }, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (minLength && e.target.value.length < minLength) {
        setError(`Мінімальна кількість символів ${minLength}`);
      } else {
        setError(null);
      }

      onChange && onChange(e);
    };

    return (
      <div>
        <div className="flex">
          <input
            type={type}
            className={cn(inputVariants({ variant, className }))}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
        </div>
        {error && <div className="text-red-500 text-xs/[8px]">{error}</div>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
