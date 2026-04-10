import {customers} from '@/data/customers';

export const getCustomer = (customerId: string) => {
  return customers.records.find((current) => {
    return current.id === customerId;
  });
};
