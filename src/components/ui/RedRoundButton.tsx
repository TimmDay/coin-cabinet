import React from 'react';
import { cn } from '~/lib/utils';

export interface RedRoundButtonProps {
  /**
   * The content to display inside the button
   */
  children: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Button size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Button type for forms
   */
  type?: 'button' | 'submit' | 'reset';
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * A red round button component with hover and focus states
 */
export const RedRoundButton: React.FC<RedRoundButtonProps> = ({
  children,
  onClick,
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        'rounded-full font-medium transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        // Color styles
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        // Shadow for depth
        'shadow-md hover:shadow-lg',
        // Transform on hover
        'hover:scale-105 active:scale-95',
        // Size variant
        sizeClasses[size],
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed hover:bg-red-600 hover:scale-100 hover:shadow-md',
        className
      )}
    >
      {children}
    </button>
  );
};
