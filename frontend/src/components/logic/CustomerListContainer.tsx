import { memo, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CustomerTable } from '../presentation/CustomerTable';
import { LoadingSpinner, ErrorMessage } from '../presentation/LoadingSpinner';
import { CustomerFormContainer } from './CustomerFormContainer';
import { useCustomers, useDeleteCustomer } from '../../hooks/useCustomers';
import { Customer } from '../../types';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const CustomerListContainer = memo(() => {
  const { data: customers = [], isLoading, error, refetch } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleAddNew = useCallback(() => {
    setEditingCustomer(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (customer: Customer) => {
      confirmAlert({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${customer.first_name} ${customer.last_name}? This action cannot be undone.`,
        buttons: [
          {
            label: 'Cancel',
            onClick: () => {},
          },
          {
            label: 'Delete',
            onClick: async () => {
              try {
                await deleteMutation.mutateAsync(customer.account_id);
                setSnackbar({
                  open: true,
                  message: 'Customer deleted successfully',
                  severity: 'success',
                });
              } catch (error: any) {
                const errorMessage =
                  error?.error?.message || 'Failed to delete customer';
                setSnackbar({
                  open: true,
                  message: errorMessage,
                  severity: 'error',
                });
              }
            },
          },
        ],
      });
    },
    [deleteMutation]
  );

  const handleFormClose = useCallback(() => {
    setFormOpen(false);
    setEditingCustomer(null);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Customer Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          Add New Account
        </Button>
      </Box>

      {isLoading && <LoadingSpinner message="Loading customers..." />}

      {error && (
        <ErrorMessage
          title="Failed to load customers"
          message={
            (error as any)?.error?.message || 'An error occurred while loading customers'
          }
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && (
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CustomerFormContainer
        open={formOpen}
        onClose={handleFormClose}
        customer={editingCustomer}
      />

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
    </Container>
  );
});

CustomerListContainer.displayName = 'CustomerListContainer';


