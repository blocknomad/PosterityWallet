import React, { forwardRef } from "react";
import classNames from 'classnames';

export default forwardRef(function Input({ className, ...props }: any, ref) {
  const baseStyles = "px-3 py-2 text-base border border-gray-200 rounded-md focus-visible:outline-none focus:ring-1 focus:ring-primary"
  const combinedClassess = classNames(baseStyles, className)

  return (
    <input ref={ref} className={combinedClassess} {...props} />
  )
});