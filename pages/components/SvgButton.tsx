import React from "react";
import classNames from 'classnames';

export default function SvgButton({ children, className, ...props }: any) {
  const baseStyles = "w-6 h-6 fill-gray-500 hover:fill-gray-900 cursor-pointer"
  const combinedClassess = classNames(baseStyles, className)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={combinedClassess} {...props}>
      {children}
    </svg>
  )
};