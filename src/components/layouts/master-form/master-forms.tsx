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

import { MASTER_FORM_CATEGORIES, MasterFormSubItem } from '@/config/master-forms-config';
import cls from './master-forms.module.scss';

type MasterFormsProps = {
  sessionId?: string;
  onNavigate?: (page: string) => void;
};

/* SVG Icons */
const ArrowRightIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const FolderIcon = (props: { className?: string }) => (
  <svg className={props.className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

export const MasterForms = (props: MasterFormsProps): JSX.Element => {
  const { onNavigate } = props;
  const navigate = useNavigate();

  const [isLoading] = React.useState<boolean>(false);
  const [alertData] = React.useState<{ message: string; severity: AlertSeverity } | null>(null);

  const { canWriteModule } = usePermission();
  const canEdit = canWriteModule(ModuleName.MASTER_FORMS);

  const handleCardClick = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    } else {
      navigate(`/${itemId}`);
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title="MASTER FORMS SETUP" />

      <Dashboard.Page>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert message={alertData.message} severity={alertData.severity} />
        )}

        {isLoading && <LoadingFeedback feedback="Loading master forms, please wait." />}

        {!isLoading && (
          <div className={cls['master-container']}>
            {MASTER_FORM_CATEGORIES.map((category) => (
              <div key={category.id} className={cls['master-section']}>
                <div className={cls['master-section__header']}>
                  <div className={cls['master-section__title-group']}>
                    <FolderIcon className={cls['master-section__icon']} />
                    <span className={cls['master-section__title']}>{category.title}</span>
                  </div>
                  <span className={cls['master-section__count']}>{category.items.length} Modules</span>
                </div>

                <div className={cls['master-grid']}>
                  {category.items.map((item) => (
                    <MasterFormBox
                      key={item.id}
                      item={item}
                      canEdit={canEdit}
                      onClick={() => handleCardClick(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

export const MasterFormBox = ({
  item,
  canEdit,
  onClick,
}: {
  item: MasterFormSubItem;
  canEdit: boolean;
  onClick: () => void;
}): JSX.Element => {
  const color = item.badgeColor || 'blue';
  const badgeCls = clsx([
    cls['master-box__icon-wrapper'],
    cls[`master-box__icon-wrapper--color-${color}`],
  ]);

  return (
    <div 
      className={cls['master-box']} 
      onClick={onClick}
    >
      <div className={cls['master-box__header']}>
        <div className={badgeCls}>
          <FolderIcon className={cls['master-box__icon']} />
        </div>
        <ArrowRightIcon className={cls['master-box__arrow']} />
      </div>
      <div className={cls['master-box__title']}>{item.title}</div>
      <div className={cls['master-box__description']}>{item.description}</div>
    </div>
  );
};