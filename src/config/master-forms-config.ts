export type MasterFormSubItem = {
  id: string;
  title: string;
  description: string;
  badgeColor?: string;
};

export type MasterFormCategory = {
  id: string;
  title: string;
  items: MasterFormSubItem[];
};

export const MASTER_FORM_CATEGORIES: MasterFormCategory[] = [
  {
    id: "general-setup",
    title: "General Setup",
    items: [
      {
        id: "property-master",
        title: "Project / Property Master",
        description: "Manage project configurations, properties, and sector details.",
        badgeColor: "purple",
      },
      {
        id: "apartment-master",
        title: "Apartment Master",
        description: "Configure apartment unit standards and details.",
        badgeColor: "green",
      },
      {
        id: "resident-master",
        title: "Resident Master",
        description: "Manage resident profiles, records, and information.",
        badgeColor: "orange",
      },
      // {
      //   id: "user-master",
      //   title: "User & Role Master",
      //   description: "Control system access, user roles, and permissions.",
      //   badgeColor: "cyan",
      // },
      {
        id: "approval-routing-master",
        title: "Approval Routing",
        description: "Configure multi-level approval workflows and routes.",
        badgeColor: "indigo",
      },
      {
        id: "email-template-master",
        title: "Email Templates",
        description: "Create and customize automated email notification templates.",
        badgeColor: "teal",
      },
      {
        id: "common-status-master",
        title: "Status Master",
        description: "Define system-wide statuses and state configurations.",
        badgeColor: "yellow",
      },
    ],
  },
  {
    id: "guest-access-setup",
    title: "Guest Access Setup",
    items: [
      {
        id: "gate-master",
        title: "Gate Master",
        description: "Configure entry/exit gates and access points.",
        badgeColor: "red",
      },
      {
        id: "guard-account-mapping-master",
        title: "Guard/Gate Mapping",
        description: "Assign security personnel and guard accounts to gate locations.",
        badgeColor: "orange",
      },
      {
        id: "security-coordinator-master",
        title: "Security Coordinator Master",
        description: "Manage security coordinator profiles and permissions.",
        badgeColor: "cyan",
      },
      {
        id: "vehicle-type-master",
        title: "Vehicle Type Master",
        description: "Define allowed vehicle categories and access rules.",
        badgeColor: "indigo",
      },
      {
        id: "qr-configuration-master",
        title: "QR Configuration",
        description: "Setup visitor QR pass rules and validity windows.",
        badgeColor: "purple",
      },
    ],
  },
  {
    id: "move-in-move-out-setup",
    title: "Move-in / Move-out Setup",
    items: [
      {
        id: "movement-type-master",
        title: "Movement Type Master",
        description: "Manage move-in and move-out request classifications.",
        badgeColor: "blue",
      },
      {
        id: "item-type-master",
        title: "Item Type Master",
        description: "Categorize goods and furniture for move inspections.",
        badgeColor: "teal",
      },
      {
        id: "movement-rule-master",
        title: "Movement Rule Master",
        description: "Define timing rules and restrictions for move activities.",
        badgeColor: "yellow",
      },
    ],
  },
  {
    id: "access-card-setup",
    title: "Access Card Setup",
    items: [
      {
        id: "access-card-master",
        title: "Access Card Master",
        description: "Manage RFID cards and keycard inventory.",
        badgeColor: "purple",
      },
      {
        id: "replacement-reason-master",
        title: "Replacement Reason",
        description: "Define standard reasons for card re-issuance.",
        badgeColor: "red",
      },
      {
        id: "replacement-fee-master",
        title: "Replacement Fee",
        description: "Configure card replacement fee structures.",
        badgeColor: "green",
      },
      {
        id: "delivery-sla-master",
        title: "Delivery SLA",
        description: "Manage card fulfillment service timelines.",
        badgeColor: "indigo",
      },
      {
        id: "payment-method-master",
        title: "Payment Method reference",
        description: "Setup accepted payment channels for card fees.",
        badgeColor: "cyan",
      },
    ],
  },
  {
    id: "restaurant-cafe-setup",
    title: "Restaurant/Cafe Setup",
    items: [
      {
        id: "venue-master",
        title: "Venue Master",
        description: "Configure dining venues, cafes, and seating zones.",
        badgeColor: "orange",
      },
      {
        id: "menu-master",
        title: "Menu Master",
        description: "Manage food items, categories, and pricing schedules.",
        badgeColor: "yellow",
      },
      {
        id: "operating-hours-master",
        title: "Operating Hours",
        description: "Define opening, closing, and kitchen operation schedules.",
        badgeColor: "teal",
      },
      {
        id: "staff-mapping-master",
        title: "Staff Mapping",
        description: "Assign kitchen and service staff to venue locations.",
        badgeColor: "indigo",
      },
      {
        id: "project-venue-mapping-master",
        title: "Project-Venue Mapping",
        description: "Link dining facilities to residential complexes.",
        badgeColor: "purple",
      },
      {
        id: "reservation-slot-rules-master",
        title: "Reservation Slot Rules",
        description: "Configure table booking slot capacities and limits.",
        badgeColor: "blue",
      },
    ],
  },
  {
    id: "sports-court-setup",
    title: "Sports Court Setup",
    items: [
      {
        id: "court-master",
        title: "Court Master",
        description: "Manage tennis, badminton, and sports facilities.",
        badgeColor: "green",
      },
      {
        id: "court-operating-hours-master",
        title: "Court Operating Hours",
        description: "Set daily availability schedules for sports courts.",
        badgeColor: "cyan",
      },
      {
        id: "court-time-slots-master",
        title: "Court Time Slots",
        description: "Define duration and timing for court session bookings.",
        badgeColor: "indigo",
      },
      {
        id: "court-blocking-master",
        title: "Court Blocking",
        description: "Schedule maintenance or reserved court periods.",
        badgeColor: "red",
      },
      {
        id: "project-court-mapping-master",
        title: "Project-Court Mapping",
        description: "Associate courts with specific residential projects.",
        badgeColor: "purple",
      },
      {
        id: "booking-rules-master",
        title: "Booking Rules",
        description: "Set advance booking limits and cancellation rules.",
        badgeColor: "yellow",
      },
    ],
  },
  {
    id: "transactions-approvals",
    title: "Transactions / Approvals",
    items: [
      {
        id: "guest-approval-master",
        title: "Guest Approval",
        description: "Review and authorize visitor entry requests.",
        badgeColor: "blue",
      },
      {
        id: "move-approval-master",
        title: "Move Approval",
        description: "Approve resident move-in/move-out applications.",
        badgeColor: "purple",
      },
      {
        id: "card-processing-master",
        title: "Card Processing",
        description: "Track access card issuing and payment approvals.",
        badgeColor: "teal",
      },
      {
        id: "restaurant-reservation-approval-master",
        title: "Restaurant Reservation Approval",
        description: "Confirm or adjust VIP table bookings.",
        badgeColor: "orange",
      },
      {
        id: "court-approval-master",
        title: "Court Approval",
        description: "Manage special event court booking requests.",
        badgeColor: "green",
      },
      {
        id: "request-history-master",
        title: "Request History",
        description: "View complete activity audit trail for all requests.",
        badgeColor: "cyan",
      },
      {
        id: "audit-logs-master",
        title: "Audit Logs",
        description: "Monitor system configuration changes and user actions.",
        badgeColor: "red",
      },
    ],
  },
];
