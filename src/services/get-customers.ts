import {CustomerRecord, CustomerStatus} from '@/types/customers';

import {customers} from '@/data/customers';

type GetCustomersArgs = {
  id?: string;
  fullName?: string;
  status?: CustomerStatus;
};

export const getCustomers = ({
  id,
  fullName,
  status = CustomerStatus.ALL,
}: GetCustomersArgs = {}): CustomerRecord[] => {
  let filteredCustomers = customers.records.filter((current) => {
    if (id) {
      return current.id.match(id);
    }
    return current;
  });
  filteredCustomers = filteredCustomers.filter((current) => {
    if (fullName) {
      return current.fullName.match(fullName);
    }
    return current;
  });
  if (status === CustomerStatus.NOT_INVITED) {
    return filteredCustomers.filter((current) => {
      return current.invitationStatus === 'not-invited';
    });
  }
  if (status === CustomerStatus.INVITATION_PENDING) {
    return filteredCustomers.filter((current) => {
      return current.invitationStatus === 'invitation-pending';
    });
  }
  if (status === CustomerStatus.ACTIVATED) {
    return filteredCustomers.filter((current) => {
      return current.invitationStatus === 'activated';
    });
  }
  if (status === CustomerStatus.BLOCKED) {
    return filteredCustomers.filter((current) => {
      return current.isBlocked === true;
    });
  }
  return filteredCustomers;
};
