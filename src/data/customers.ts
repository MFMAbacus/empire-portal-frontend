import {CustomerRecord} from '@/types/customers';

export const customers: {records: CustomerRecord[]} = {
  records: [
    {
      id: 'C-0001',
      fullName: 'Ada Gerhold',
      address: '97031 Spinka Drive',
      email: 'ada.gerhold@gmail.com',
      invitationStatus: 'not-invited',
      isBlocked: false,
    },
    {
      id: 'C-0002',
      fullName: 'Yesenia Stanton',
      address: '4425 Sam Centers',
      email: 'yesenia.stanton@gmail.com',
      invitationStatus: 'invitation-pending',
      isBlocked: true,
    },
    {
      id: 'C-0003',
      fullName: 'Adrien Gislason',
      address: '57379 Kerluke Road',
      email: 'adrien.gislason@gmail.com',
      invitationStatus: 'activated',
      isBlocked: false,
    },
    {
      id: 'C-0004',
      fullName: 'Alice Kshlerin',
      address: '230 Tyrel Spur',
      email: 'alice.kshlerin@gmail.com',
      invitationStatus: 'not-invited',
      isBlocked: true,
    },
    {
      id: 'C-0005',
      fullName: 'Floyd Hickle',
      address: '519 Jerome Squares',
      email: 'floyd.hickle@gmail.com',
      invitationStatus: 'invitation-pending',
      isBlocked: false,
    },
    {
      id: 'C-0006',
      fullName: 'Cathryn Maggio',
      address: '578 McKenzie Path',
      email: 'cathryn.maggio@gmail.com',
      invitationStatus: 'activated',
      isBlocked: false,
    },
    {
      id: 'C-0007',
      fullName: 'Fidel Weimann',
      address: '199 Swift Shoals',
      email: 'fidel.weimann@gmail.com',
      invitationStatus: 'not-invited',
      isBlocked: true,
    },
  ],
};
