import {customers} from '@/data/customers';

export const inviteCustomer = (customerId: string) => {
  return customers.records = customers.records.map((current) => {
    if (current.id === customerId) {
      return {
        ...current,
        invitationStatus: 'invitation-pending',
      };
    }
    return current;
  });
};
