import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/testUtils';
import { CustomerForm } from '../../components/presentation/CustomerForm';
import { useForm } from 'react-hook-form';
import { CreateCustomerInput } from '../../types';
import userEvent from '@testing-library/user-event';

// Wrapper component to provide form context
const FormWrapper = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit?: (data: CreateCustomerInput) => void;
  defaultValues?: Partial<CreateCustomerInput>;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateCustomerInput>({
    defaultValues: defaultValues || {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      country: '',
    },
  });

  return (
    <form onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}>
      <CustomerForm control={control} errors={errors} />
      <button type="submit">Submit</button>
    </form>
  );
};

describe('CustomerForm', () => {
  it('should render all form fields', () => {
    render(<FormWrapper />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
  });

  it('should mark required fields correctly', () => {
    render(<FormWrapper />);

    const firstNameField = screen.getByLabelText(/first name/i);
    const lastNameField = screen.getByLabelText(/last name/i);
    const emailField = screen.getByLabelText(/email/i);

    expect(firstNameField).toBeRequired();
    expect(lastNameField).toBeRequired();
    expect(emailField).toBeRequired();
  });

  it('should set email field type to email', () => {
    render(<FormWrapper />);

    const emailField = screen.getByLabelText(/email/i);
    expect(emailField).toHaveAttribute('type', 'email');
  });

  it('should display default values when provided', async () => {
    const defaultValues: CreateCustomerInput = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    };

    render(<FormWrapper defaultValues={defaultValues} />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
    expect(screen.getByDisplayValue('NY')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
  });

  it('should allow user input', async () => {
    const user = userEvent.setup();
    render(<FormWrapper />);

    const firstNameField = screen.getByLabelText(/first name/i);
    const emailField = screen.getByLabelText(/email/i);

    await user.type(firstNameField, 'Jane');
    await user.type(emailField, 'jane@example.com');

    expect(firstNameField).toHaveValue('Jane');
    expect(emailField).toHaveValue('jane@example.com');
  });

  it('should disable fields when isSubmitting is true', () => {
    const FormWrapperWithSubmitting = () => {
      const {
        control,
        formState: { errors },
      } = useForm<CreateCustomerInput>();

      return <CustomerForm control={control} errors={errors} isSubmitting={true} />;
    };

    render(<FormWrapperWithSubmitting />);

    const firstNameField = screen.getByLabelText(/first name/i);
    expect(firstNameField).toBeDisabled();
  });

  it('should display error messages for invalid fields', () => {
    const FormWrapperWithErrors = () => {
      const {
        control,
        formState: { errors },
      } = useForm<CreateCustomerInput>({
        errors: {
          first_name: {
            type: 'required',
            message: 'First name is required',
          },
          email: {
            type: 'pattern',
            message: 'Invalid email format',
          },
        },
      });

      return <CustomerForm control={control} errors={errors} />;
    };

    render(<FormWrapperWithErrors />);

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('should display "Optional" helper text for optional fields', () => {
    render(<FormWrapper />);

    const phoneField = screen.getByLabelText(/phone number/i);
    const addressField = screen.getByLabelText(/address/i);

    expect(phoneField.closest('div')?.querySelector('.MuiFormHelperText-root')).toHaveTextContent(
      'Optional'
    );
    expect(addressField.closest('div')?.querySelector('.MuiFormHelperText-root')).toHaveTextContent(
      'Optional'
    );
  });

  it('should have correct grid layout for responsive design', () => {
    const { container } = render(<FormWrapper />);

    // Check that Grid components are rendered
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();

    // Check that Grid items are rendered
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    expect(gridItems.length).toBeGreaterThan(0);
  });
});

