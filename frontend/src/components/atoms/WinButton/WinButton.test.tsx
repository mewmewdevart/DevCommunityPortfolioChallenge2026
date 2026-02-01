import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WinButton } from './WinButton';

describe('WinButton Component', () => {
    it('renders children correctly', () => {
        render(<WinButton>Click Me</WinButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = vi.fn();
        render(<WinButton onClick={handleClick}>Click Me</WinButton>);

        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies taskbar styles when variant is taskbar', () => {
        const { container } = render(<WinButton variant="taskbar">Taskbar</WinButton>);
        expect(container.firstChild).toHaveClass('win-btn-taskbar');
    });

    it('applies active styles when active prop is true', () => {
        const { container } = render(<WinButton active={true}>Active</WinButton>);
        expect(container.firstChild).toHaveClass('win-btn-normal-sunken');
    });

    it('applies menu styles when variant is menu', () => {
        const { container } = render(<WinButton variant="menu">Menu Item</WinButton>);
        expect(container.firstChild).toHaveClass('win-btn-menu');
    });
});
