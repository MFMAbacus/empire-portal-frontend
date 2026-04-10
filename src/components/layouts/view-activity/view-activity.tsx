import React from 'react';

import {Dashboard} from '@/components/layouts/dashboard';
import {Actionbar} from '@/components/layouts/action-bar';
import {Paper} from '@/components/base/paper';
import {Button} from '@/components/base/button';

import {EditIcon} from '@/components/icons/edit-icon';
import {ArrowLeftIcon} from '@/components/icons/arrow-left-icon';
import {PlusIcon} from '@/components/icons/plus-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {getActivity} from '@/services/get-activity';

import {clsx} from '@/utility/clsx';

import sheetSvg from '@/assets/images/sheet.svg';

import cls from './view-activity.module.scss';

type ViewActivityProps = {
  activityId: string;
  onEdit: (activityId: string) => void;
  onBack: () => void;
};

export const ViewActivity = ({
  activityId,
  onEdit,
  onBack,
}: ViewActivityProps): JSX.Element => {
  const activity = React.useMemo(() => {
    return getActivity(activityId);
  }, [activityId]);

  return (
    <Dashboard.Content>
      <Actionbar title='VIEW ACTIVITY'>
        <Button
          label='EDIT'
          icon={<EditIcon />}
          onClick={() => onEdit(activityId)}
        />
        <Button
          label='GO BACK'
          icon={<ArrowLeftIcon />}
          onClick={onBack}
        />
      </Actionbar>
      <Dashboard.Page>
        <div className={cls['layout']}>
          <div className={cls['col']}>
            <div className={cls['row']}>
              <Paper>
                <div className={cls['detail-owner']}>
                  <img
                    className={cls['detail-owner_sheet']}
                    src={sheetSvg}
                    alt='sheet'
                  />
                  <div className={cls['detail-owner_info']}>
                    <span className={cls['detail-owner_name']}>
                      {activity ? activity.subject : '-'}
                    </span>
                    <span className={cls['detail-owner_address']}>
                      {activity && activity.location ?
                        activity.location: '-'}
                    </span>
                  </div>
                </div>
                <h2 className={cls['details-paper_title']}>
                  DESCRIPTION
                </h2>
                <p className={cls['details-paper_description']}>
                  {activity && activity.description ?
                    activity.description: '-'}
                </p>
                <ul className={cls['details-paper_list']}>
                  <DetailCard
                    label='STATUS'
                    value={activity ? activity.status.label : '-'}
                  />
                  <DetailCard
                    label='ASSIGNED TO'
                    value={activity && activity.assignedTo ?
                      activity.assignedTo.fullName : '-'}
                  />
                  <DetailCard
                    label='DUE DATE'
                    value={activity && activity.dueDate ?
                      activity.dueDate : '-'}
                  />
                </ul>
              </Paper>
            </div>
            <div className={cls['row']}>
              <Paper>
                <Paper.Title value='Updates' />
                <ul className={cls['timeline']}>
                  <TimelineEntry isCreate>
                    <Button
                      className={cls['create_btn']}
                      label='Update'
                      onClick={() => onEdit(activityId)}
                    />
                  </TimelineEntry>
                  <TimelineEntry>
                    <TimelineCard
                      action='Activity has been created'
                      date={activity ? activity.createdAt : '-'}
                    />
                  </TimelineEntry>
                </ul>
              </Paper>
            </div>
          </div>
          <div className={clsx([cls['col'], cls['col_right']])}>
            <div className={cls['row']}>
              <Paper>
                <Paper.Title value='Details' />
                <ul className={cls['info-list']}>
                  <InfoCard
                    label='ID'
                    value={activity ? activity.id : '-'}
                  />
                  <InfoCard
                    label='Type'
                    value={activity ? activity.type.label : '-'}
                  />
                  <InfoCard
                    label='Category'
                    value={activity ? activity.category.label : '-'}
                  />
                  <InfoCard
                    label='Priority'
                    value={activity ? activity.priority.label : '-'}
                  />
                  <InfoCard
                    label='Project'
                    value='Project 1'
                  />
                  <InfoCard
                    label='Unit'
                    value='Unit 1'
                  />
                </ul>
              </Paper>
            </div>
            <div className={cls['row']}>
              <Paper>
                <Paper.Title value='Contact' />
                <ul className={cls['info-list']}>
                  <InfoCard
                    label='Customer'
                    value={activity && activity.customer ?
                      activity.customer.fullName : '-'}
                  />
                  <InfoCard
                    label='Entry Contact'
                    value={activity && activity.entryContact ?
                      activity.entryContact : '-'}
                  />
                  <InfoCard
                    label='Visit Date'
                    value={activity && activity.visitDate ?
                      activity.visitDate : '-'}
                  />
                </ul>
              </Paper>
            </div>
          </div>
        </div>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const DetailCard = ({label, value}: InfoCardProps): JSX.Element => {
  return (
    <li className={cls['detail-card']}>
      {label}
      <span className={cls['detail-card_value']}>{value}</span>
    </li>
  );
};

const InfoCard = ({label, value}: InfoCardProps): JSX.Element => {
  return (
    <li className={cls['info-card']}>
      <span className={cls['info-card_label']}>{label}</span>
      {value}
    </li>
  );
};

const TimelineCard = ({action, date}: TimelineItemProps): JSX.Element => {
  return (
    <div className={cls['timeline-card']}>
      <div className={cls['timeline-card_icon-w']}>
        <CheckIcon className={cls['timeline-card_icon']} />
      </div>
      <div className={cls['timeline-card_info-w']}>
        <span className={cls['timeline-card_label']}>{action}</span>
        {date}
      </div>
    </div>
  );
};

const TimelineEntry = (props: TimelineEntryProps): JSX.Element => {
  const {isCreate, children} = props;

  const classes = clsx([
    cls['timeline_entry'],
    isCreate && cls['timeline_create'],
  ]);

  return (
    <li className={classes}>
      <div className={cls['timeline_entry--box']}>
        {isCreate && <PlusIcon className={cls['timeline_entry--box_icon']} />}
      </div>
      {children}
    </li>
  );
};

type InfoCardProps = {
  label: string;
  value: string;
};

type TimelineItemProps = {
  action: string;
  date: string;
};

type TimelineEntryProps = {
  isCreate?: boolean;
  children: React.ReactNode;
};
