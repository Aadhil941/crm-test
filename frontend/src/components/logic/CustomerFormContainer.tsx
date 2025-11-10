import { memo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { CustomerForm } from '../presentation/CustomerForm';
import { CustomerModal } from '../presentation/CustomerModal';
import { CreateCustomerInput, Customer } from '../../types';
import { useCreateCustomer, useUpdateCustomer } from '../../hooks/useCustomers';

const customerSchema = yup.object().shape({
  first_name: yup.string().required('First name is required').max(100, 'First name must be less than 100 characters'),
  last_name: yup.string().required('Last name is required').max(100, 'Last name must be less than 100 characters'),
  email: yup.string().required('Email is required').email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone_number: yup.string().max(20, 'Phone number must be less than 20 characters'),
  address: yup.string().max(255, 'Address must be less than 255 characters'),
  city: yup.string().max(100, 'City must be less than 100 characters'),
  state: yup.string().max(100, 'State must be less than 100 characters'),
  country: yup.string().max(100, 'Country must be less than 100 characters'),
});

interface CustomerFormContainerProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export const CustomerFormContainer = memo<CustomerFormContainerProps>(
  ({ open, onClose, customer }) => {
    const isEditMode = !!customer;
    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();
    const [snackbar, setSnackbar] = useState<{
      open: boolean;
      message: string;
      severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<CreateCustomerInput>({
      resolver: yupResolver(customerSchema),
      defaultValues: customer
        ? {
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone_number: customer.phone_number || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            country: customer.country || '',
          }
        : {
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

    const onSubmit = useCallback(
      async (data: CreateCustomerInput) => {
        try {
          if (isEditMode && customer) {
            await updateMutation.mutateAsync({
              id: customer.account_id,
              input: data,
            });
            setSnackbar({
              open: true,
              message: 'Customer updated successfully',
              severity: 'success',
            });
          } else {
            await createMutation.mutateAsync(data);
            setSnackbar({
              open: true,
              message: 'Customer created successfully',
              severity: 'success',
            });
          }
          reset();
          onClose();
        } catch (error: any) {
          const errorMessage =
            error?.error?.message || 'An error occurred. Please try again.';
          setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error',
          });
        }
      },
      [isEditMode, customer, createMutation, updateMutation, reset, onClose]
    );

    const handleClose = useCallback(() => {
      reset();
      onClose();
    }, [reset, onClose]);

    const handleSnackbarClose = useCallback(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, []);

    return (
      <>
        <CustomerModal
          open={open}
          onClose={handleClose}
          title={isEditMode ? 'Edit Customer Account' : 'Add New Customer Account'}
          maxWidth="md"
          actions={
            <Box display="flex" gap={2}>
              <Button onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update'
                  : 'Create'}
              </Button>
            </Box>
          }
        >
          <CustomerForm
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </CustomerModal>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }
);

CustomerFormContainer.displayName = 'CustomerFormContainer';


