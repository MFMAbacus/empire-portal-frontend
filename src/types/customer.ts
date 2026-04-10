export type Vehicle = {
  id: string;
  palletNumber: string;
  model: string;
  type: string;
  color: string;
};

export type SapCustomer = {
  PortalCode: string;
  CardCode: string;
  CardName: string;
  UnitCode: string;
};

export type Customer = {
  id: string;
  projectId: string | null;
  subProject: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  comments: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactNumber: string | null;
  vehicles: Vehicle[];
  password: string;
  isInvited: boolean;
  isActive: boolean;
  isBlocked: boolean;
};
