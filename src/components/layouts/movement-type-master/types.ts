export type MovementTypeFilters = {
  movementTypeId?:string;  // Database ki Primary Key (e.g., 1, 2, 3)
  type?: string;                 // Dynamic name search (DB se aane wala name)
  isActive?: boolean;                // Active/Inactive status filter
  showArchived?: boolean;            // Soft deleted records ke liye
};