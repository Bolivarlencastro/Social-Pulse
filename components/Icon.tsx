
import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md', filled = false, ...props }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const style = filled ? { fontVariationSettings: "'FILL' 1" } : {};

  return (
    <span
      className={`material-symbols-outlined select-none ${sizeClasses[size]} ${className}`}
      style={style}
      {...props}
    >
      {name}
    </span>
  );
};
