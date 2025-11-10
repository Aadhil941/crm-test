import { createContext, useContext, ReactNode } from 'react';

interface ApiContextType {
  baseUrl: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  return (
    <ApiContext.Provider value={{ baseUrl }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
};




