export type SubTaskRecord = {
  id: string;
  title: string;
  staffId: string | null;
  staffName: string | null;
  isComplete: boolean;
  completedAt: string | null;
};

export type TaskStatus = 'new' | 'active' | 'on-hold' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskUpdateType = 'created' | 'activated' | 'completed' |
  'paused' | 'resumed' | 'checked-in' | 'checked-out' | 'closed';

export type TaskUpdate = {
  id: string;
  userId: string;
  userName: string;
  type: TaskUpdateType;
  date: string;
};

export type TaskAttendanceStatus = 'check-in' | 'check-out';

export type TaskAttendance = {
  staffId: string;
  staffName: string;
  status: TaskAttendanceStatus;
  date: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  customerId: string | null;
  customerName: string | null;
  staffName: string | null;
  projectId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  creationDate: string;
  visitDate: string;
  visitTime: string;
  dueDate: string;
  subTasks: SubTaskRecord[];
  updates: TaskUpdate[];
  attachments: string[];
  completeAttachments: string[];
  completeRemarks: string | null;
  attendance: TaskAttendance[];
  isClosed: boolean;
  closedAt: string | null;
  isArchived: boolean;
  bls: string[];
  fls: string[];
};
