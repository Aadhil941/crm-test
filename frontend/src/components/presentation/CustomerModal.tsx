import { memo, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CustomerModal = memo<CustomerModalProps>(
  ({ open, onClose, title, children, actions, maxWidth = 'md' }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {title}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  }
);

CustomerModal.displayName = 'CustomerModal';


