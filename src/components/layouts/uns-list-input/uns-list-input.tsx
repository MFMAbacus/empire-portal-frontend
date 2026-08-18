import * as React from 'react';

import {Unit} from '@/types/unit';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';
import {TextInput} from '@/components/base/text-input';

import {useForm} from '@/hooks/use-form';

import {makeGetUnitsService} from '@/services/get-units-service';

type UnsListInputProps = {
  selectedUns?: string[];
  pts?: string[];
  pss?: string[];
  prs?: string[];
  bls?: string[];
  fls?: string[];
  css?: string[];
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
  onSelectAll?: (uns: string[]) => void;
};

export const UnsListInput = ({
  selectedUns = [],
  pts,
  pss,
  prs,
  bls,
  fls,
  css,
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
}: UnsListInputProps): JSX.Element => {
  const [
    units,
    setUnits,
  ] = React.useState<Unit[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const units = data as Unit[];
    setUnits(units);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetUnitsService,
    onSuccess: handleSuccess,
  });

  const loadUnits = React.useCallback(() => {
    setUnits([]);
    submit({
      sessionId,
      propertyTypes: pts,
      purposes: pss,
      projects: prs,
      buildings: bls,
      fllors: fls,
      customers: css,
    });
  }, [
    sessionId,
    pts,
    pss,
    prs,
    bls,
    fls,
    css,
    submit,
  ]);

  React.useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const value = React.useMemo(() => {
    if (selectedUns.length > 1) {
      return `${selectedUns.length} items selected.`;
    }
    const foundUn = units.find((current) => current.id === selectedUns[0]);
    if (typeof foundUn !== 'undefined') {
      return foundUn.name;
    }
    return 'None';
  }, [
    units,
    selectedUns,
  ]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredUns = React.useMemo(() => {
    return units.filter((unit) => {
      let predicate = true;
      if (filterName !== '') {
        predicate &&= Boolean(
            unit.name.toLowerCase().match(filterName.toLocaleLowerCase()),
        );
      }
      return predicate;
    });
  }, [
    units,
    filterName,
  ]);

  return (
    <ListInput
      className={className}
      label='Units'
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
                onSelectAll && onSelectAll(units.map((units) => {
                  return units.id;
                }));
              }}
            />
            <Map
              items={filteredUns}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={item.name}
                    isActive={selectedUns.includes(item.id)}
                    onClick={() => {
                      if (!selectedUns.includes(item.id)) {
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
