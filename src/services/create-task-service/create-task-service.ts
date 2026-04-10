import {TaskPriority} from '@/types/task';

export type Input = {
  sessionId: string;
  customerId: string,
  categoryId: string,
  categoryName: string,
  projectId: string;
  title: string,
  description: string,
  visitDate: string,
  visitTime: string,
  priority: TaskPriority,
  dueDate: string,
  attachments: string[];
  bls: string[];
  fls: string[];
};
