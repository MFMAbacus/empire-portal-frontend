import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from '@/utility/clsx';
import { AlertSeverity } from '@/types/alert';

import { LoadingFeedback } from '@/components/base/loading-feedback';
import { Alert } from '@/components/base/alert';

import { Dashboard } from '@/components/layouts/dashboard';
import { Actionbar } from '@/components/layouts/action-bar';

import { usePermission } from '@/hooks/use-permission';
import { ModuleName } from '@/types/user';

import cls from './master-forms.module.scss';

export type MasterFormItem = {
  id: string;
  title: string;
  description: string;
  page: string;
  icon: (props: { className?: string }) => JSX.Element;
  badgeColor?: MasterBadgeColor;
};

type MasterFormsProps = {
  sessionId?: string;
  onNavigate?: (page: string) => void;
};

export enum MasterBadgeColor {
  PURPLE = 'purple',
  GREEN = 'green',
  ORANGE = 'orange',
  CYAN = 'cyan',
  INDIGO = 'indigo',
  TEAL = 'teal',
  YELLOW = 'yellow',
  RED = 'red',
  BLUE = 'blue',
}

/* SVG Icons */
const BuildingIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const RulerIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UsersIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserCheckIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GitMergeIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const MailIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SlidersIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const DEFAULT_MASTER_FORMS: MasterFormItem[] = [
  {
    id: 'property-master',
    title: 'Project / Property Master',
    page: '/property-master',
    description: 'Manage project configurations, properties, and sector details.',
    icon: BuildingIcon,
    badgeColor: MasterBadgeColor.PURPLE,
  },
  {
    id: 'apartment-master',
    title: 'Apartment / Unit Master ',
    page: '/apartment-master',
    description: 'Configure and define standard measurement units.',
    icon: RulerIcon,
    badgeColor: MasterBadgeColor.GREEN,
  },
  {
    id: 'resident-master',
    title: 'Resident Master',
    page: '/resident-master',
    description: 'Manage resident profiles, records, and information.',
    icon: UsersIcon,
    badgeColor: MasterBadgeColor.ORANGE,
  },
  // {
  //   id: 'user-master',
  //   title: 'User / Role Master',
  //   page: '/user-master',
  //   description: 'Control system access, user roles, and permissions.',
  //   icon: UserCheckIcon,
  //   badgeColor: MasterBadgeColor.CYAN,
  // },
  {
    id: 'approval-routing-master',
    title: 'Approval Routing Master',
    page: '/approval-routing-master',
    description: 'Configure multi-level approval workflows and routes.',
    icon: GitMergeIcon,
    badgeColor: MasterBadgeColor.INDIGO,
  },
  {
    id: 'email-template-master',
    title: 'Email Template Master',
    page: '/email-template-master',
    description: 'Create and customize automated email notification templates.',
    icon: MailIcon,
    badgeColor: MasterBadgeColor.TEAL,
  },
  {
    id: 'common-status-master',
    title: 'Common Status Master',
    page: '/common-status-master',
    description: 'Define system-wide statuses and state configurations.',
    icon: SlidersIcon,
    badgeColor: MasterBadgeColor.YELLOW,
  },
];

export const MasterForms = (props: MasterFormsProps): JSX.Element => {
  const { onNavigate } = props;
  const navigate = useNavigate();

  const [isLoading] = React.useState<boolean>(false);
  const [alertData] = React.useState<{ message: string; severity: AlertSeverity } | null>(null);

  const { canWriteModule } = usePermission();
  const canEdit = canWriteModule(ModuleName.MASTER_FORMS);

  const handleCardClick = (item: MasterFormItem) => {
    if (onNavigate) {
      // App.tsx state management key pass karein
      onNavigate(item.id); 
    } else {
      // Direct React Router path
      navigate(item.page); 
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="MASTER FORMS" />

      <Dashboard.Page>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert message={alertData.message} severity={alertData.severity} />
        )}

        {isLoading && <LoadingFeedback feedback="Loading master forms, please wait." />}

        {!isLoading && (
          <div className={cls['master-grid']}>
            {DEFAULT_MASTER_FORMS.map((item) => (
              <MasterFormBox
                key={item.id}
                title={item.title}
                description={item.description}
                canEdit={canEdit}
                icon={item.icon}
                color={item.badgeColor || MasterBadgeColor.BLUE}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

export const MasterFormBox = ({
  title,
  description,
  icon: IconComponent,
  color,
  onClick,
}: {
  title: string;
  description: string;
  canEdit: boolean;
  icon: (props: { className?: string }) => JSX.Element;
  color: MasterBadgeColor;
  onClick: () => void;
}): JSX.Element => {
  const badgeCls = clsx([
    cls['master-box__icon-wrapper'],
    cls[`master-box__icon-wrapper--color-${color}`],
  ]);

  return (
    <div 
      className={cls['master-box']} 
      onClick={onClick}
    >
      <div className={badgeCls}>
        <IconComponent className={cls['master-box__icon']} />
      </div>
      <div className={cls['master-box__title']}>{title}</div>
      <div className={cls['master-box__description']}>{description}</div>
    </div>
  );
};