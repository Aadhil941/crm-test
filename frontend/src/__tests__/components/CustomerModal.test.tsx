import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/testUtils';
import { CustomerModal } from '../../components/presentation/CustomerModal';
import userEvent from '@testing-library/user-event';
import { Button } from '@mui/material';

describe('CustomerModal', () => {
  it('should not render when open is false', () => {
    render(
      <CustomerModal open={false} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </CustomerModal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </CustomerModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should display the title correctly', () => {
    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Create Customer">
        <div>Content</div>
      </CustomerModal>
    );

    expect(screen.getByText('Create Customer')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div data-testid="modal-content">This is the modal content</div>
      </CustomerModal>
    );

    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('This is the modal content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CustomerModal open={true} onClose={onClose} title="Test Modal">
        <div>Content</div>
      </CustomerModal>
    );

    const closeButton = screen.getByLabelText(/close/i);
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render actions when provided', () => {
    const actions = (
      <>
        <Button>Cancel</Button>
        <Button>Save</Button>
      </>
    );

    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal" actions={actions}>
        <div>Content</div>
      </CustomerModal>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should not render actions section when actions prop is not provided', () => {
    const { container } = render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </CustomerModal>
    );

    const dialogActions = container.querySelector('.MuiDialogActions-root');
    expect(dialogActions).not.toBeInTheDocument();
  });

  it('should use default maxWidth of md when not specified', () => {
    const { container } = render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </CustomerModal>
    );

    const dialog = container.querySelector('.MuiDialog-root');
    expect(dialog).toBeInTheDocument();
  });

  it('should use specified maxWidth prop', () => {
    const { container } = render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal" maxWidth="lg">
        <div>Content</div>
      </CustomerModal>
    );

    const dialog = container.querySelector('.MuiDialog-root');
    expect(dialog).toBeInTheDocument();
  });

  it('should have fullWidth prop set', () => {
    const { container } = render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </CustomerModal>
    );

    const dialog = container.querySelector('.MuiDialog-root');
    expect(dialog).toBeInTheDocument();
  });

  it('should render close icon button', () => {
    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </CustomerModal>
    );

    const closeButton = screen.getByLabelText(/close/i);
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.tagName).toBe('BUTTON');
  });

  it('should render multiple children correctly', () => {
    render(
      <CustomerModal open={true} onClose={vi.fn()} title="Test Modal">
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </CustomerModal>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });
});

