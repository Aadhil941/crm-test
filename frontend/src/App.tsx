import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ApiProvider } from './context/ApiContext';
import { CustomerListContainer } from './components/logic/CustomerListContainer';
import { CustomerDetailContainer } from './components/logic/CustomerDetailContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApiProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<CustomerListContainer />} />
              <Route path="/customers/:id" element={<CustomerDetailContainer />} />
            </Routes>
          </BrowserRouter>
        </ApiProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;


