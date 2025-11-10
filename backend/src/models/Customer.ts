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
  date_created: Date;
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



