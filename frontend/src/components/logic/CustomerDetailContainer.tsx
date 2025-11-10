import { memo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import { LoadingSpinner, ErrorMessage } from '../presentation/LoadingSpinner';
import { useCustomer } from '../../hooks/useCustomers';
import { useParams } from 'react-router-dom';

export const CustomerDetailContainer = memo(() => {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, error, refetch } = useCustomer(id);

  if (isLoading) {
    return <LoadingSpinner message="Loading customer details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <ErrorMessage
          title="Failed to load customer"
          message={
            (error as any)?.error?.message ||
            'An error occurred while loading customer details'
          }
          onRetry={() => refetch()}
        />
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Customer not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Customer Details
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Account ID
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {customer.account_id}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              First Name
            </Typography>
            <Typography variant="body1">{customer.first_name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Name
            </Typography>
            <Typography variant="body1">{customer.last_name}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{customer.email}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone Number
            </Typography>
            <Typography variant="body1">
              {customer.phone_number || (
                <Typography component="span" color="text.secondary">
                  Not provided
                </Typography>
              )}
            </Typography>
          </Grid>

          {customer.address && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">{customer.address}</Typography>
            </Grid>
          )}

          {(customer.city || customer.state || customer.country) && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {customer.city && <Chip label={customer.city} size="small" />}
                {customer.state && (
                  <Chip label={customer.state} size="small" />
                )}
                {customer.country && (
                  <Chip label={customer.country} size="small" />
                )}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Date Created
            </Typography>
            <Typography variant="body1">
              {new Date(customer.date_created).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
});

CustomerDetailContainer.displayName = 'CustomerDetailContainer';


