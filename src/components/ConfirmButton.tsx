"use client";

import type { ButtonHTMLAttributes } from "react";

type ConfirmButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmMessage: string;
};

export function ConfirmButton({ confirmMessage, onClick, ...props }: ConfirmButtonProps) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}
