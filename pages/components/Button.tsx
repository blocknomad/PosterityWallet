import React, { MouseEvent, ReactNode } from "react";
import classNames from 'classnames';

type Props = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  size?: "normal" | "small";
  success?: boolean;
  type?: any;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ children, className, size = 'normal', variant = "primary", ...props }: Props) {
  const baseStyles = 'py-2 px-4 rounded-md font-medium focus:outline-none transition duration-200 border border-solid text-base';

  const variantStyles = classNames({
    'bg-primary hover:bg-primary-hover active:bg-primary-active text-white border-primary': variant === 'primary',
    'bg-white hover:bg-gray-100 active:bg-gray-200 text-black border-gray-200': variant === 'secondary',
    'py-1 px-2 text-sm': size === 'small',
    'disabled:opacity-50 disabled:cursor-not-allowed': props.disabled,
    '!bg-green-500 text-white pointer-events-none': props.success,
  });


  const combinedClasses = classNames(baseStyles, variantStyles, className);

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
};