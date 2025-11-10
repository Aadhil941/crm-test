import { memo, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Customer } from '../../types';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  isLoading?: boolean;
}

export const CustomerTable = memo<CustomerTableProps>(
  ({ customers, onEdit, onDelete, isLoading = false }) => {
    const formatDate = useMemo(
      () => (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      []
    );

    if (isLoading) {
      return (
        <Box p={3} textAlign="center">
          <Typography>Loading customers...</Typography>
        </Box>
      );
    }

    if (customers.length === 0) {
      return (
        <Box p={3} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            No customers found. Click "Add New Account" to create one.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Account ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Phone
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                Date Created
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: 'bold', color: 'white' }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.account_id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {customer.account_id.substring(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {customer.first_name} {customer.last_name}
                  </Typography>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {customer.phone_number || (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {customer.city || customer.state || customer.country ? (
                    <Chip
                      label={`${customer.city || ''}${
                        customer.city && customer.state ? ', ' : ''
                      }${customer.state || ''}${
                        (customer.city || customer.state) && customer.country
                          ? ', '
                          : ''
                      }${customer.country || ''}`}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(customer.date_created)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(customer)}
                    aria-label="edit customer"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(customer)}
                    aria-label="delete customer"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

CustomerTable.displayName = 'CustomerTable';


