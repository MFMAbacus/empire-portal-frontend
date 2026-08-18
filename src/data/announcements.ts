import {AnnouncementRecord} from '@/types/announcements';

export const announcements: {records: AnnouncementRecord[]} = {
  records: [
    {
      id: 'A-0001',
      createdAt: '2023-03-13',
      expiresAt: '2023-03-13',
      title: 'Upcoming Inspections',
      description: 'Upcoming Inspections',
    },
    {
      id: 'A-0002',
      title: 'Tennis Playground Survey',
      description: 'Tennis Playground Survey',
      createdAt: '2023-03-13',
      expiresAt: null,
    },
    {
      id: 'A-0003',
      title: 'Change in meeting timings',
      description: 'Change in meeting timings',
      createdAt: '2023-03-13',
      expiresAt: '2023-03-13',
    },
    {
      id: 'A-0004',
      title: 'Security measures',
      description: 'Security measures',
      createdAt: '2023-03-13',
      expiresAt: '2023-03-13',
    },
    {
      id: 'A-0005',
      title: 'New green initiatives',
      description: 'New green initiatives',
      createdAt: '2023-03-13',
      expiresAt: null,
    },
  ],
};
