import * as React from 'react';

import {Floor} from '@/types/floor';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';
import {TextInput} from '@/components/base/text-input';

import {useForm} from '@/hooks/use-form';

import {makeGetFloorsService} from '@/services/get-floors-service';

type FlsListInputProps = {
  selectedBls?: string[];
  selectedFls?: string[];
  feedback?: string;
  className?: string;
  sessionId: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  autoClose?: boolean;
  onClear?: () => void;
  onSelect?: (un: string) => void;
  onRemove?: (un: string) => void;
  onSelectAll?: (prs: string[]) => void;
};

export const FlsListInput = ({
  selectedBls = [],
  selectedFls = [],
  feedback,
  className,
  sessionId,
  isRequired = false,
  isDisabled = false,
  hasError = false,
  autoClose = false,
  onClear,
  onSelect,
  onRemove,
  onSelectAll,
}: FlsListInputProps): JSX.Element => {
  const [
    floors,
    setFloors,
  ] = React.useState<Floor[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const floors = data as Floor[];
    setFloors(floors);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetFloorsService,
    onSuccess: handleSuccess,
  });

  const loadFloors = React.useCallback(() => {
    setFloors([]);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadFloors();
  }, [loadFloors]);

  const value = React.useMemo(() => {
    if (selectedFls.length > 1) {
      return `${selectedFls.length} items selected.`;
    }
    const foundFl = floors.find((current) => current.id === selectedFls[0]);
    if (typeof foundFl !== 'undefined') {
      return foundFl.name;
    }
    return 'None';
  }, [
    floors,
    selectedFls,
  ]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredFls = React.useMemo(() => {
    return floors.sort((a, b) => {
      if (a.name < b.name) return -1;
      return 1;
    }).filter((floor) => {
      let predicate = true;
      predicate &&= selectedBls.includes(floor.buildingId);
      if (filterName !== '') {
        predicate &&= Boolean(
            floor.name.toLowerCase().match(filterName.toLocaleLowerCase()),
        );
      }
      return predicate;
    });
  }, [
    floors,
    selectedBls,
    filterName,
  ]);

  return (
    <ListInput
      className={className}
      label='Floors'
      feedback={feedback}
      value={value}
      isRequired={isRequired}
      isDisabled={isLoading || isDisabled}
      hasError={hasError}>
      {(onClose) => {
        return (
          <React.Fragment>
            <ListInput.Header>
              <TextInput
                className='w-100'
                value={filterName}
                placeholder='Search.'
                hasInitialFocus
                onChange={setFilterName}
              />
            </ListInput.Header>
            <ListInput.Item
              label='Clear Selection'
              isSoft
              onClick={onClear}
            />
            <ListInput.Item
              label='Select All'
              isSoft
              onClick={() => {
                onSelectAll && onSelectAll(filteredFls.map((floor) => {
                  return floor.id;
                }));
              }}
            />
            <Map
              items={filteredFls}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={item.name}
                    isActive={selectedFls.includes(item.id)}
                    onClick={() => {
                      if (!selectedFls.includes(item.id)) {
                        if (typeof onSelect !== 'undefined') {
                          onSelect(item.id);
                          autoClose && onClose();
                        }
                      } else {
                        if (typeof onRemove !== 'undefined') {
                          onRemove(item.id);
                          autoClose && onClose();
                        }
                      }
                    }}
                  />
                );
              }}
            />
          </React.Fragment>
        );
      }}
    </ListInput>
  );
};
