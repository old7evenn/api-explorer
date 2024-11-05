'use client';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from '@nextui-org/react';
import { forwardRef, useState } from 'react';

import type { InputProps } from './input';
import { Input } from './input';

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className="text-foreground relative"
          ref={ref}
          onChange={e => e.target.value}
          minLength={8}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent bg-transparent  focus:outline-none focus:ring-0"
          onClick={() => setShowPassword(!showPassword)}
          disabled={!props.value || props.disabled}
        >
          {showPassword ? (
            <EyeOutlined className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeInvisibleOutlined className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
