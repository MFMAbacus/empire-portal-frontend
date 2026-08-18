import * as React from 'react';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';
import {TextInput} from '@/components/base/text-input';

type PssListInputProps = {
  selectedPss?: string[];
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

const purposes = ['Commercial', 'Residential'];

export const PssListInput = ({
  selectedPss = [],
  feedback,
  className,
  isRequired = false,
  isDisabled = false,
  hasError = false,
  autoClose = false,
  onClear,
  onSelect,
  onRemove,
  onSelectAll,
}: PssListInputProps): JSX.Element => {
  const value = React.useMemo(() => {
    if (selectedPss.length > 1) {
      return `${selectedPss.length} items selected.`;
    }
    const foundPs = purposes.find((current) => current === selectedPss[0]);
    if (typeof foundPs !== 'undefined') {
      return foundPs;
    }
    return 'None';
  }, [
    selectedPss,
  ]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredPss = React.useMemo(() => {
    return purposes.filter((purpose) => {
      let predicate = true;
      if (filterName !== '') {
        predicate &&= Boolean(
            purpose.toLowerCase().match(filterName.toLocaleLowerCase()),
        );
      }
      return predicate;
    });
  }, [
    filterName,
  ]);

  return (
    <ListInput
      className={className}
      label='Purpose'
      feedback={feedback}
      value={value}
      isRequired={isRequired}
      isDisabled={isDisabled}
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
                onSelectAll && onSelectAll(purposes.map((purposes) => {
                  return purposes;
                }));
              }}
            />
            <Map
              items={filteredPss}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item}
                    label={item}
                    isActive={selectedPss.includes(item)}
                    onClick={() => {
                      if (!selectedPss.includes(item)) {
                        if (typeof onSelect !== 'undefined') {
                          onSelect(item);
                          autoClose && onClose();
                        }
                      } else {
                        if (typeof onRemove !== 'undefined') {
                          onRemove(item);
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
