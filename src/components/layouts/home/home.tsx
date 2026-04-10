import React from 'react';
import {Chart} from 'react-google-charts';

import {clsx} from '@/utility/clsx';

import {Filters} from './types';
import {AlertSeverity} from '@/types/alert';

import {Button} from '@/components/base/button';
import {Grid} from '@/components/base/grid';
import {LoadingFeedback} from '@/components/base/loading-feedback';
import {Alert} from '@/components/base/alert';

import {Dashboard} from '@/components/layouts/dashboard';
import {Actionbar} from '@/components/layouts/action-bar';
import {FilterModal} from './filter-modal';

import {FilterIcon} from '@/components/icons/filter-icon';

import {useForm} from '@/hooks/use-form';
import {makeGetStatsService} from '@/services/get-stats-service';

import logoPng from '@/assets/images/logo.png';

import cls from './home.module.scss';

export type Stats = {
  totalRequests: number,
  receivedRequests: number,
  inProgressRequests: number,
  closedRequests: number,

  totalTasks: number;
  createdTasks: number;
  activatedTasks: number;
  onHoldTasks: number;
  closedTasks: number;

  totalCustomers: number;
  activeCustomers: number;
  invitedCustomers: number;
  notInvitedCustomers: number;
  blockedCustomers: number;

  totalStaff: number;
  busyStaff: number;
  availableStaff: number;

  totalAnnouncements: number;
  activeAnnouncements: number;
  expiredAnnouncements: number;

  totalItems: number;
  t1ItemCount: number;
  t2ItemCount: number;
  t3ItemCount: number;
  t1ItemName: string;
  t2ItemName: string;
  t3ItemName: string;
};

type HomeProps = {
  sessionId: string;
};

export const Home = (props: HomeProps): JSX.Element => {
  const {
    sessionId,
  } = props;

  const [
    stats,
    setStats,
  ] = React.useState<Stats | null>(null);

  const [
    filters,
    setFilters,
  ] = React.useState<Filters>({});

  const [
    filterModal,
    setFilterModal,
  ] = React.useState<boolean>(false);

  const handleSuccess = React.useCallback((data: unknown) => {
    const stats = data as Stats;
    setStats(stats);
  }, []);

  const {
    isLoading,
    alertData,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetStatsService,
    onSuccess: handleSuccess,
  });

  const loadStats = React.useCallback(() => {
    setStats(null);
    submit({
      minDate: filters.minDate,
      maxDate: filters.maxDate,
      sessionId,
    });
  }, [
    sessionId,
    filters,
    submit,
  ]);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <Dashboard.Content>
      <Actionbar title='WELCOME TO EMPIRE WORLD'>
        <Button
          className='mr-1'
          label='EXPORT TO PDF'
          onClick={() => {
            window.print();
          }}
        />
        <Button
          label='FILTER'
          icon={<FilterIcon />}
          onClick={() => setFilterModal(true)}
        />
      </Actionbar>
      <div className={cls['pdf-header']}>
        <div>
          <div className={cls['pdf-header__title']}>
            Performance Report
          </div>
          <div className={cls['pdf-header__dates']}>
            {filters.minDate ? filters.minDate : 'Infinit'} / {filters.maxDate ? filters.maxDate : 'Infinit'}
          </div>
        </div>
        <div>
          <img
            className={cls['pdf-header__logo']}
            src={logoPng}
            alt='Empire World'
          />
        </div>
      </div>
      <Dashboard.Page>
        {(
          alertData !== null &&
          alertData.severity !== AlertSeverity.SUCCESS
        ) && (
          <Alert
            message={alertData.message}
            severity={alertData.severity}
          />
        )}
        {isLoading && (
          <LoadingFeedback feedback='Loading stats, please wait.' />
        )}
        {(!isLoading && stats !== null) && (
          <React.Fragment>
            <Grid>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Requests'
                  value={String(stats.totalRequests)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.BLUE}
                        value={String(stats.receivedRequests)}
                        label='Received'
                      />
                      <StatLine
                        color={StatLineColor.PINK}
                        value={String(stats.inProgressRequests)}
                        label='In-Progress'
                      />
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.closedRequests)}
                        label='Completed'
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Requests', 'Counts'],
                        ['Received', stats.receivedRequests],
                        ['In-Progress', stats.inProgressRequests],
                        ['Completed', stats.closedRequests],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.BLUE,
                          Colors.PINK,
                          Colors.GREEN,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Tasks'
                  value={String(stats.totalTasks)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.BLUE}
                        value={String(stats.createdTasks)}
                        label='Created'
                      />
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.activatedTasks)}
                        label='In Progress'
                      />
                      <StatLine
                        color={StatLineColor.ORANGE}
                        value={String(stats.onHoldTasks)}
                        label='On Hold'
                      />
                      <StatLine
                        color={StatLineColor.RED}
                        value={String(stats.closedTasks)}
                        label='Closed'
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Tasks', 'Counts'],
                        ['Created', stats.createdTasks],
                        ['In Progress', stats.activatedTasks],
                        ['On Hold', stats.onHoldTasks],
                        ['Closed', stats.closedTasks],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.BLUE,
                          Colors.GREEN,
                          Colors.ORANGE,
                          Colors.RED,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Customers'
                  value={String(stats.totalCustomers)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.BLUE}
                        value={String(stats.activeCustomers)}
                        label='Active'
                      />
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.invitedCustomers)}
                        label='Invitation Pending'
                      />
                      <StatLine
                        color={StatLineColor.ORANGE}
                        value={String(stats.notInvitedCustomers)}
                        label='Not Invited'
                      />
                      <StatLine
                        color={StatLineColor.RED}
                        value={String(stats.blockedCustomers)}
                        label='Blocked'
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Customers', 'Counts'],
                        ['Active', stats.totalCustomers],
                        ['Invitation Pending', stats.invitedCustomers],
                        ['Not Invited', stats.notInvitedCustomers],
                        ['Blocked', stats.blockedCustomers],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.BLUE,
                          Colors.GREEN,
                          Colors.ORANGE,
                          Colors.RED,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
            </Grid>
            <Grid>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Items'
                  value={String(stats.totalItems)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.BLUE}
                        value={String(stats.t1ItemCount)}
                        label={stats.t1ItemName}
                      />
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.t2ItemCount)}
                        label={stats.t2ItemName}
                      />
                      <StatLine
                        color={StatLineColor.ORANGE}
                        value={String(stats.t3ItemCount)}
                        label={stats.t3ItemName}
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Items', 'Counts'],
                        [stats.t1ItemName, stats.t1ItemCount],
                        [stats.t2ItemName, stats.t2ItemCount],
                        [stats.t3ItemName, stats.t3ItemCount],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.BLUE,
                          Colors.GREEN,
                          Colors.PINK,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Staff'
                  value={String(stats.totalStaff)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.RED}
                        value={String(stats.busyStaff)}
                        label='Busy'
                      />
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.availableStaff)}
                        label='Available'
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Staff', 'Counts'],
                        ['Busy', stats.busyStaff],
                        ['Available', stats.availableStaff],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.RED,
                          Colors.GREEN,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S4}>
                <StatBox
                  label='Announcements'
                  value={String(stats.totalAnnouncements)}
                  lines={(
                    <React.Fragment>
                      <StatLine
                        color={StatLineColor.GREEN}
                        value={String(stats.activeAnnouncements)}
                        label='Active'
                      />
                      <StatLine
                        color={StatLineColor.RED}
                        value={String(stats.expiredAnnouncements)}
                        label='Expired'
                      />
                    </React.Fragment>
                  )}
                  chart={(
                    <Chart
                      chartType='PieChart'
                      width="100%"
                      height="200px"
                      data={[
                        ['Staff', 'Counts'],
                        ['Active', stats.activeAnnouncements],
                        ['Expired', stats.expiredAnnouncements],
                      ]}
                      options={{
                        pieHole: 0.4,
                        is3D: false,
                        colors: [
                          Colors.GREEN,
                          Colors.RED,
                        ],
                        legend: 'none',
                        pieSliceText: 'none',
                        backgroundColor: 'transparent',
                      }}
                      legend_toggle
                    />
                  )}
                />
              </Grid.Cell>
            </Grid>
          </React.Fragment>
        )}
      </Dashboard.Page>
      {filterModal && (
        <FilterModal
          defaultFilters={filters}
          onFilter={setFilters}
          onClose={() => setFilterModal(false)}
        />
      )}
    </Dashboard.Content>
  );
};

export const StatBox = ({
  label,
  value,
  lines,
  chart,
}: {
  label: string;
  value: string;
  lines: React.ReactNode;
  chart: React.ReactNode;
}): JSX.Element => {
  return (
    <div className={cls['stat-box']}>
      <div className={cls['stat-box__left']}>
        <div className={cls['stat-box__label']}>
          {label}
        </div>
        <div className={cls['stat-box__value']}>
          {value}
        </div>
        {lines}
      </div>
      <div className={cls['stat-box__right']}>
        {chart}
      </div>
    </div>
  );
};

enum Colors {
  RED = '#FF8787',
  GREEN = '#B2F2BB',
  BLUE = '#C6DDF0',
  ORANGE = '#FFC078',
  PINK = '#F3D9FA',
}

enum StatLineColor {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  ORANGE = 'orange',
  PINK = 'pink',
}

export const StatLine = ({
  color,
  value,
  label,
}: {
  color: StatLineColor;
  value: string;
  label: string;
}): JSX.Element => {
  const rootCls = clsx([
    cls['stat-box__line'],
    cls[`stat-box__line--color-${color}`],
  ]);

  return (
    <div className={rootCls}>
      <div className={cls['stat-box__line-dot']}>
      </div>
      <div className={cls['stat-box__line-val']}>
        {value}
      </div>
      <div className={cls['stat-box__line-label']}>
        {label !== 'N/A' ? label.substr(0, 16) + '...' : label}
      </div>
    </div>
  );
};
