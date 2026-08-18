import * as React from 'react';

import {Filters} from './types';

import {Button} from '@/components/base/button';
import {Modal} from '@/components/base/modal';
import {TextInput} from '@/components/base/text-input';
import {Grid} from '@/components/base/grid';
import {DateInput} from '@/components/base/date-input';
import {ListInput} from '@/components/base/list-input';

import {FilterIcon} from '@/components/icons/filter-icon';
import {PriorityListInput} from '@/components/layouts/priority-list-input';
import {Checkbox} from '@/components/base/checkbox';

type FilterModalProps = {
  defaultFilters: Filters;
  onFilter: (filters: Filters) => void;
  onClose: () => void;
};

export const FilterModal = ({
  defaultFilters,
  onFilter,
  onClose,
}: FilterModalProps): JSX.Element => {
  const [
    filters,
    setFilters,
  ] = React.useState<Filters>(defaultFilters);

  return (
    <Modal>
      <Modal.Header title='Filter meetings' />
      <Modal.Body>
        <Grid>
          <TextInput
            className='w-100'
            label='ID'
            placeholder='Enter ID.'
            value={typeof filters.id !== 'undefined' ? filters.id : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                id: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <TextInput
            className='w-100'
            label='Subject'
            placeholder='Enter subject.'
            value={typeof filters.subject !== 'undefined' ? filters.subject : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                subject: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <DateInput
            className='w-100'
            label='Date'
            placeholder='Enter date.'
            value={typeof filters.date !== 'undefined' ? filters.date : ''}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                date: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <PriorityListInput
            className='w-100'
            label='Importance'
            priority={filters.importance}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                importance: value,
              };
            })}
          />
        </Grid>
        <Grid>
          <ListInput
            className='w-100'
            label='Sort By'
            value={!filters.sortBy ? 'None' : sortNameMap[filters.sortBy]}>
            {(onClose) => {
              return (
                <React.Fragment>
                  <ListInput.Item
                    label='None'
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: undefined,
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === undefined}
                  />
                  <ListInput.Item
                    label='Date'
                    onClick={() => {
                      setFilters((filters) => {
                        return {
                          ...filters,
                          sortBy: 'date',
                        };
                      });
                      onClose();
                    }}
                    isActive={filters.sortBy === 'date'}
                  />
                </React.Fragment>
              );
            }}
          </ListInput>
        </Grid>
        {filters.sortBy && (
          <Grid>
            <ListInput
              className='w-100'
              label='Sort Order'
              value={!filters.sortOrder ? 'None' : filters.sortOrder.toUpperCase()}>
              {(onClose) => {
                return (
                  <React.Fragment>
                    <ListInput.Item
                      label='None'
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: undefined,
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === undefined}
                    />
                    <ListInput.Item
                      label='ASC'
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: 'asc',
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === 'asc'}
                    />
                    <ListInput.Item
                      label='DESC'
                      onClick={() => {
                        setFilters((filters) => {
                          return {
                            ...filters,
                            sortOrder: 'desc',
                          };
                        });
                        onClose();
                      }}
                      isActive={filters.sortOrder === 'desc'}
                    />
                  </React.Fragment>
                );
              }}
            </ListInput>
          </Grid>
        )}
        <Grid>
          <Checkbox
            label='Show Archived'
            isChecked={filters.showArchived}
            onChange={(value) => setFilters((filters) => {
              return {
                ...filters,
                showArchived: value,
              };
            })}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='ml-05'
          label='FILTER'
          icon={<FilterIcon />}
          onClick={() => {
            onFilter(filters);
            onClose();
          }}
        />
        <Button
          className='ml-05'
          label='CLEAR FILTERS'
          onClick={() => {
            onFilter({});
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

const sortNameMap: {[id: string]: string} = {
  'date': 'Date',
};
