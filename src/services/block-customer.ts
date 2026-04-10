import {customers} from '@/data/customers';

type BlockCustomerArgs = {
  customerId: string;
  isBlocked: boolean;
};

export const blockCustomer = ({
  customerId,
  isBlocked,
}: BlockCustomerArgs) => {
  return customers.records = customers.records.map((current) => {
    if (current.id === customerId) {
      return {
        ...current,
        isBlocked,
      };
    }
    return current;
  });
};
