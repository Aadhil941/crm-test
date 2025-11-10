export interface Customer {
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  date_created: string;
}

export interface CreateCustomerInput {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateCustomerInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    stack?: string;
  };
}



