import * as React from 'react';

import {PropertyType} from '@/types/property-type';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';
import {TextInput} from '@/components/base/text-input';

import {useForm} from '@/hooks/use-form';

import {makeGetPropertyTypesService} from '@/services/get-property-types-service';

type PtsListInputProps = {
  selectedPts?: string[];
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

export const PtsListInput = ({
  selectedPts = [],
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
}: PtsListInputProps): JSX.Element => {
  const [
    types,
    setTypes,
  ] = React.useState<PropertyType[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const types = data as PropertyType[];
    setTypes(types);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetPropertyTypesService,
    onSuccess: handleSuccess,
  });

  const loadTypes = React.useCallback(() => {
    setTypes([]);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredPts = React.useMemo(() => {
    return types.filter((type) => {
      let predicate = true;
      if (filterName !== '') {
        predicate &&= Boolean(
            type.name.toLowerCase().match(filterName.toLocaleLowerCase()),
        );
      }
      return predicate;
    });
  }, [
    types,
    filterName,
  ]);

  const value = React.useMemo(() => {
    if (selectedPts.length > 1) {
      return `${selectedPts.length} items selected.`;
    }
    const foundPt = types.find((current) => current.id === selectedPts[0]);
    if (typeof foundPt !== 'undefined') {
      return foundPt.name;
    }
    return 'None';
  }, [
    types,
    selectedPts,
  ]);

  return (
    <ListInput
      className={className}
      label='Property Type'
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
                onSelectAll && onSelectAll(types.map((type) => {
                  return type.id;
                }));
              }}
            />
            <Map
              items={filteredPts}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={item.name}
                    isActive={selectedPts.includes(item.id)}
                    onClick={() => {
                      if (!selectedPts.includes(item.id)) {
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
