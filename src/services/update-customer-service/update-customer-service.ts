export type Input = {
  sessionId: string;
  id: string;
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
  password?: string;
};
