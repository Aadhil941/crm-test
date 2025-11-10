import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/testUtils';
import { CustomerTable } from '../../components/presentation/CustomerTable';
import { Customer } from '../../types';
import userEvent from '@testing-library/user-event';

const mockCustomers: Customer[] = [
  {
    account_id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    date_created: '2024-01-01T10:00:00Z',
  },
  {
    account_id: '223e4567-e89b-12d3-a456-426614174001',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone_number: null,
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    date_created: '2024-01-02T11:00:00Z',
  },
  {
    account_id: '323e4567-e89b-12d3-a456-426614174002',
    first_name: 'Bob',
    last_name: 'Johnson',
    email: 'bob.johnson@example.com',
    phone_number: '+5555555555',
    address: null,
    city: null,
    state: null,
    country: null,
    date_created: '2024-01-03T12:00:00Z',
  },
];

describe('CustomerTable', () => {
  it('should render loading state when isLoading is true', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[]} onEdit={onEdit} onDelete={onDelete} isLoading={true} />
    );

    expect(screen.getByText(/loading customers/i)).toBeInTheDocument();
  });

  it('should render empty state when no customers exist', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[]} onEdit={onEdit} onDelete={onDelete} isLoading={false} />
    );

    expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/click "add new account" to create one/i)
    ).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={mockCustomers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText(/account id/i)).toBeInTheDocument();
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/phone/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
    expect(screen.getByText(/date created/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });

  it('should render all customers in the table', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={mockCustomers} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob.johnson@example.com')).toBeInTheDocument();
  });

  it('should display truncated account ID', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    const accountIdElement = screen.getByText(/123e4567\.\.\./i);
    expect(accountIdElement).toBeInTheDocument();
  });

  it('should display phone number when available', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('should display dash when phone number is null', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[1]]} onEdit={onEdit} onDelete={onDelete} />
    );

    // The dash is rendered as text, so we check for it
    const phoneCell = screen.getByText('Jane Smith').closest('tr')?.querySelectorAll('td')[3];
    expect(phoneCell?.textContent).toContain('-');
  });

  it('should display location chip when location data exists', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    expect(screen.getByText(/new york.*ny.*usa/i)).toBeInTheDocument();
  });

  it('should display dash when location data is missing', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[2]]} onEdit={onEdit} onDelete={onDelete} />
    );

    // Location cell should show dash
    const locationCell = screen.getByText('Bob Johnson').closest('tr')?.querySelectorAll('td')[4];
    expect(locationCell?.textContent).toContain('-');
  });

  it('should format date correctly', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    // Date should be formatted and displayed
    const dateCell = screen.getByText('John Doe').closest('tr')?.querySelectorAll('td')[5];
    expect(dateCell?.textContent).toBeTruthy();
    expect(dateCell?.textContent).toMatch(/\d{1,2}/); // Should contain numbers
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    const editButtons = screen.getAllByLabelText(/edit customer/i);
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={[mockCustomers[0]]} onEdit={onEdit} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByLabelText(/delete customer/i);
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should render edit and delete buttons for each customer', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <CustomerTable customers={mockCustomers} onEdit={onEdit} onDelete={onDelete} />
    );

    const editButtons = screen.getAllByLabelText(/edit customer/i);
    const deleteButtons = screen.getAllByLabelText(/delete customer/i);

    expect(editButtons).toHaveLength(mockCustomers.length);
    expect(deleteButtons).toHaveLength(mockCustomers.length);
  });
});

