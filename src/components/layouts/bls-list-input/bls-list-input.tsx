import * as React from 'react';

import {Building} from '@/types/building';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';
import {TextInput} from '@/components/base/text-input';

import {useForm} from '@/hooks/use-form';

import {makeGetBuildingsService} from '@/services/get-buildings-service';

type BlsListInputProps = {
  selectedPrs?: string[];
  selectedBls?: string[];
  feedback?: string;
  className?: string;
  sessionId: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  autoClose?: boolean;
  onClear?: () => void;
  onSelect?: (bl: string) => void;
  onRemove?: (bl: string) => void;
  onSelectAll?: (bls: string[]) => void;
};

export const BlsListInput = ({
  selectedPrs = [],
  selectedBls = [],
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
}: BlsListInputProps): JSX.Element => {
  const [
    buildings,
    setBuildings,
  ] = React.useState<Building[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const buildings = data as Building[];
    setBuildings(buildings);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetBuildingsService,
    onSuccess: handleSuccess,
  });

  const loadBuildings = React.useCallback(() => {
    setBuildings([]);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredBls = React.useMemo(() => {
    return buildings.filter((building) => {
      let predicate = true;
      predicate &&= selectedPrs.includes(building.projectId);
      if (filterName !== '') {
        predicate &&= Boolean(
            building.name.toLowerCase().match(filterName.toLocaleLowerCase()),
        );
      }
      return predicate;
    });
  }, [
    buildings,
    selectedPrs,
    filterName,
  ]);

  const value = React.useMemo(() => {
    if (selectedBls.length > 1) {
      return `${selectedBls.length} items selected.`;
    }
    const foundBl = buildings.find((current) => current.id === selectedBls[0]);
    if (typeof foundBl !== 'undefined') {
      return foundBl.name;
    }
    return 'None';
  }, [
    buildings,
    selectedBls,
  ]);

  return (
    <ListInput
      className={className}
      label='Buildings'
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
                onSelectAll && onSelectAll(filteredBls.map((building) => {
                  return building.id;
                }));
              }}
            />
            <Map
              items={filteredBls}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={item.name}
                    isActive={selectedBls.includes(item.id)}
                    onClick={() => {
                      if (!selectedBls.includes(item.id)) {
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
