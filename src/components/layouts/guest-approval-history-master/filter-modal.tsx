import * as React from 'react';

import { Button } from '@/components/base/button';
import { Modal } from '@/components/base/modal';
import { TextInput } from '@/components/base/text-input';
import { DateInput } from '@/components/base/date-input';
import { ListInput } from '@/components/base/list-input';
import { Grid } from '@/components/base/grid';
import { Map } from '@/components/base/map';

import { FilterIcon } from '@/components/icons/filter-icon';

type GuestApprovalHistoryFilterProps = {
  defaultRequestNo: string | null;
  defaultStartDate: string | null;
  defaultEndDate: string | null;
  defaultStatus: string | null;
  onFilter: (filters: {
    requestNo: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }) => void;
  onClose: () => void;
};

export const GuestApprovalHistoryFilterModal = ({
  defaultRequestNo,
  defaultStartDate,
  defaultEndDate,
  defaultStatus,
  onFilter,
  onClose,
}: GuestApprovalHistoryFilterProps): JSX.Element => {
  const [requestNo, setRequestNo] = React.useState<string | null>(defaultRequestNo);
  const [startDate, setStartDate] = React.useState<string | null>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<string | null>(defaultEndDate);
  const [status, setStatus] = React.useState<string | null>(defaultStatus);

  const statusOptions = [
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
    { id: 'Checked-in', name: 'Checked-in' },
    { id: 'Expired', name: 'Expired' },
  ];

  const hasFilters =
    (requestNo !== null && requestNo !== '') ||
    (startDate !== null && startDate !== '') ||
    (endDate !== null && endDate !== '') ||
    (status !== null && status !== '');

  return (
    <Modal>
      <Modal.Header title='Filter Guest Approval History' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='Request No'
            placeholder='Enter request number (e.g. REQ-001)'
            value={requestNo}
            onChange={(val: any) => {
              const text = typeof val === 'string' ? val : val?.target?.value || '';
              setRequestNo(text);
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
              requestNo,
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
              requestNo: null,
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