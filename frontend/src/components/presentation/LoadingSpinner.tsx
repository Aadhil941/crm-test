import { memo } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(
  ({ message = 'Loading...', size = 40 }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
        gap={2}
      >
        <CircularProgress size={size} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = memo<ErrorMessageProps>(
  ({ title = 'Error', message, onRetry }) => {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
        {onRetry && (
          <Box mt={1}>
            <Typography
              component="button"
              onClick={onRetry}
              sx={{
                textDecoration: 'underline',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: 'inherit',
              }}
            >
              Try again
            </Typography>
          </Box>
        )}
      </Alert>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';


