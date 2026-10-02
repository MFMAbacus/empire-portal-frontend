import * as React from 'react';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { DateInput } from '@/components/base/date-input';
import { ListInput } from '@/components/base/list-input';
import { Grid } from '@/components/base/grid';
import { Map } from '@/components/base/map';

import { FilterIcon } from '@/components/icons/filter-icon';

type RestaurantReservationHistoryFilterProps = {
  defaultReservationNo: string | null;
  defaultStartDate: string | null;
  defaultEndDate: string | null;
  defaultStatus: string | null;
  onFilter: (filters: {
    reservationNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => void;
  onClose: () => void;
};

export const RestaurantReservationHistoryFilterModal = ({
  defaultReservationNo,
  defaultStartDate,
  defaultEndDate,
  defaultStatus,
  onFilter,
  onClose,
}: RestaurantReservationHistoryFilterProps): JSX.Element => {
  const [reservationNo, setReservationNo] = React.useState<string | null>(defaultReservationNo);
  const [startDate, setStartDate] = React.useState<string | null>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<string | null>(defaultEndDate);
  const [status, setStatus] = React.useState<string | null>(defaultStatus);

  const statusOptions = [
    { id: 'Approved', name: 'Approved' },
    { id: 'Arrived', name: 'Arrived' },
    { id: 'Expired', name: 'Expired' },
    { id: 'Rejected', name: 'Rejected' },
  ];

  const hasFilters =
    (reservationNo !== null && reservationNo !== '') ||
    (startDate !== null && startDate !== '') ||
    (endDate !== null && endDate !== '') ||
    (status !== null && status !== '');

  return (
    <Modal>
      <Modal.Header title='Filter Restaurant Reservation History' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='Reservation No'
            placeholder='Enter reservation number (e.g. RR-000001)'
            value={reservationNo}
            onChange={(val: any) => {
              const text = typeof val === 'string' ? val : val?.target?.value || '';
              setReservationNo(text);
            }}
          />
        </Grid>
        <Grid>
          <DateInput
            className='w-100'
            label='Start Date'
            placeholder='YYYY-MM-DD'
            value={startDate !== null ? startDate : ''}
            onChange={(val: any) => {
              const text = typeof val === 'string' ? val : val?.target?.value || '';
              setStartDate(text);
            }}
          />
        </Grid>
        <Grid>
          <DateInput
            className='w-100'
            label='End Date'
            placeholder='YYYY-MM-DD'
            value={endDate !== null ? endDate : ''}
            onChange={(val: any) => {
              const text = typeof val === 'string' ? val : val?.target?.value || '';
              setEndDate(text);
            }}
          />
        </Grid>
        <Grid>
          <ListInput
            className='w-100'
            label='Status'
            value={status || undefined}
            placeholder='Select status filter'
          >
            {(listOnClose) => (
              <React.Fragment>
                <ListInput.Item
                  label='All Statuses'
                  isActive={!status}
                  onClick={() => {
                    setStatus(null);
                    listOnClose();
                  }}
                />
                <Map
                  items={statusOptions}
                  renderItem={(item) => (
                    <ListInput.Item
                      key={item.id}
                      label={item.name}
                      isActive={status === item.id}
                      onClick={() => {
                        setStatus(item.id);
                        listOnClose();
                      }}
                    />
                  )}
                />
              </React.Fragment>
            )}
          </ListInput>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='FILTER'
          icon={<FilterIcon />}
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              reservationNo,
              startDate,
              endDate,
              status,
            });
            onClose();
          }}
        />
        <Button
          className='ml-05'
          label='CLEAR'
          isDisabled={!hasFilters}
          onClick={() => {
            onFilter({
              reservationNo: null,
              startDate: null,
              endDate: null,
              status: null,
            });
            onClose();
          }}
        />
        <Button
          label='CLOSE'
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};
