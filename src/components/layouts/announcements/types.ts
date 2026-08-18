export type Filters = {
  id?: string;
  title?: string;
  publishDate?: string;
  publishStartDate?: string;
  publishEndDate?: string;
  range?: boolean;
  expirationDate?: string;
  permanent?: boolean;
  showArchived?: boolean;
  sortBy?: 'publish-date' | 'expiration-date';
  sortOrder?: 'asc' | 'desc';
};
