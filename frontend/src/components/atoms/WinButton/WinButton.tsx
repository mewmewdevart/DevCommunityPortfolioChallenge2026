import React from 'react';
import './WinButton.css';

interface WinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  className?: string;
  variant?: 'normal' | 'menu' | 'taskbar';
}

const BASE_STYLE = 'win-btn-base';
const NORMAL_RAISED = 'win-btn-normal-raised';
const NORMAL_SUNKEN = 'win-btn-normal-sunken';
const MENU_STYLE = 'win-btn-menu';
const TASKBAR_BASE = 'win-btn-taskbar';
const TASKBAR_INACTIVE = `${TASKBAR_BASE} win-btn-taskbar-inactive`;
const TASKBAR_ACTIVE = `${TASKBAR_BASE} win-btn-taskbar-active`;

export const WinButton = React.forwardRef<HTMLButtonElement, WinButtonProps>(({
  children,
  active = false,
  className = '',
  variant = 'normal',
  ...props
}, ref) => {
  let selectedStyle = '';

  switch (variant) {
    case 'menu':
      selectedStyle = MENU_STYLE;
      break;
    case 'taskbar':
      selectedStyle = active ? TASKBAR_ACTIVE : TASKBAR_INACTIVE;
      break;
    case 'normal':
    default:
      selectedStyle = active ? NORMAL_SUNKEN : NORMAL_RAISED;
      break;
  }

  return (
    <button
      ref={ref}
      className={`${BASE_STYLE} ${selectedStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

WinButton.displayName = 'WinButton';
