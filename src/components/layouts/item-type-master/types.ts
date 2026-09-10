export type ItemTypeFilters = {
  itemTypeId?: string;     // Primary Key / Code Filter (e.g., "IT-01")
  itemTypeName?: string;   // Item Type / Category Name Search (e.g., "Plumbing")
  description?: string;    // Description Text Search
  isActive?: boolean;      // Active/Inactive status filter
  showArchived?: boolean;  // Soft deleted records ke liye
};