import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RedRoundButton } from './RedRoundButton';

describe('RedRoundButton', () => {
  it('renders with children', () => {
    render(<RedRoundButton>Click me</RedRoundButton>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<RedRoundButton onClick={handleClick}>Click me</RedRoundButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <RedRoundButton onClick={handleClick} disabled>
        Click me
      </RedRoundButton>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<RedRoundButton size="sm">Small</RedRoundButton>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<RedRoundButton size="md">Medium</RedRoundButton>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<RedRoundButton size="lg">Large</RedRoundButton>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('applies disabled styles when disabled', () => {
    render(<RedRoundButton disabled>Disabled</RedRoundButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<RedRoundButton className="custom-class">Button</RedRoundButton>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('supports different button types', () => {
    render(<RedRoundButton type="submit">Submit</RedRoundButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
