import { memo, useMemo } from 'react';
import {
  TextField,
  Grid,
  Box,
} from '@mui/material';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { CreateCustomerInput } from '../../types';

interface CustomerFormProps {
  control: Control<CreateCustomerInput>;
  errors: FieldErrors<CreateCustomerInput>;
  isSubmitting?: boolean;
}

export const CustomerForm = memo<CustomerFormProps>(
  ({ control, errors, isSubmitting = false }) => {
    const fields = useMemo(
      () => [
        {
          name: 'first_name' as const,
          label: 'First Name',
          required: true,
          xs: 12,
          sm: 6,
        },
        {
          name: 'last_name' as const,
          label: 'Last Name',
          required: true,
          xs: 12,
          sm: 6,
        },
        {
          name: 'email' as const,
          label: 'Email',
          required: true,
          type: 'email',
          xs: 12,
          sm: 6,
        },
        {
          name: 'phone_number' as const,
          label: 'Phone Number',
          required: false,
          xs: 12,
          sm: 6,
        },
        {
          name: 'address' as const,
          label: 'Address',
          required: false,
          xs: 12,
        },
        {
          name: 'city' as const,
          label: 'City',
          required: false,
          xs: 12,
          sm: 4,
        },
        {
          name: 'state' as const,
          label: 'State',
          required: false,
          xs: 12,
          sm: 4,
        },
        {
          name: 'country' as const,
          label: 'Country',
          required: false,
          xs: 12,
          sm: 4,
        },
      ],
      []
    );

    return (
      <Box component="form" sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={field.xs} sm={field.sm} key={field.name}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Box>
                    <TextField
                      {...controllerField}
                      label={field.label}
                      type={field.type || 'text'}
                      required={field.required}
                      fullWidth
                      disabled={isSubmitting}
                      error={!!errors[field.name]}
                      helperText={
                        errors[field.name]?.message || (
                          field.required ? '' : 'Optional'
                        )
                      }
                      variant="outlined"
                    />
                  </Box>
                )}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

CustomerForm.displayName = 'CustomerForm';


