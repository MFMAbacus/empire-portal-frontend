import * as React from 'react';

import {Project} from '@/types/project';

import {ListInput} from '@/components/base/list-input';
import {Map} from '@/components/base/map';

import {useForm} from '@/hooks/use-form';

import {makeGetProjectsService} from '@/services/get-projects-service';
import {TextInput} from '@/components/base/text-input';

type PrsListInputProps = {
  selectedPrs?: string[];
  feedback?: string;
  className?: string;
  sessionId: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
  autoClose?: boolean;
  multiSelect?: boolean;
  onClear?: () => void;
  onSelect?: (pr: string) => void;
  onRemove?: (pr: string) => void;
  onSelectAll?: (prs: string[]) => void;
};

export const PrsListInput = ({
  selectedPrs = [],
  feedback,
  className,
  sessionId,
  label = 'Projects',
  isRequired = false,
  isDisabled = false,
  hasError = false,
  autoClose = false,
  multiSelect = true,
  onClear,
  onSelect,
  onRemove,
  onSelectAll,
}: PrsListInputProps): JSX.Element => {
  const [
    projects,
    setProjects,
  ] = React.useState<Project[]>([]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const projects = data as Project[];
    setProjects(projects);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetProjectsService,
    onSuccess: handleSuccess,
  });

  const loadProjects = React.useCallback(() => {
    setProjects([]);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const [
    filterName,
    setFilterName,
  ] = React.useState<string>('');

  const filteredPrs = React.useMemo(() => {
    if (filterName === '') {
      return projects;
    }
    return projects.filter((project) => {
      return project.name.toLowerCase().match(filterName.toLocaleLowerCase());
    });
  }, [
    projects,
    filterName,
  ]);

  const value = React.useMemo(() => {
    if (selectedPrs.length > 1) {
      return `${selectedPrs.length} items selected.`;
    }
    const foundPr = projects.find((current) => {
      return current.id === selectedPrs[0];
    });
    if (typeof foundPr !== 'undefined') {
      return foundPr.name;
    }
    return 'None';
  }, [
    projects,
    selectedPrs,
  ]);

  return (
    <ListInput
      className={className}
      label={label}
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
            {multiSelect && (
              <React.Fragment>
                <ListInput.Item
                  label='Clear Selection'
                  isSoft
                  onClick={onClear}
                />
                <ListInput.Item
                  label='Select All'
                  isSoft
                  onClick={() => {
                    onSelectAll && onSelectAll(projects.map((project) => {
                      return project.id;
                    }));
                  }}
                />
              </React.Fragment>
            )}
            <Map
              items={filteredPrs}
              renderItem={(item) => {
                return (
                  <ListInput.Item
                    key={item.id}
                    label={item.name}
                    isActive={selectedPrs.includes(item.id)}
                    onClick={() => {
                      if (!multiSelect) {
                        if (typeof onSelect !== 'undefined') {
                          onSelect(item.id);
                          onClose();
                        }
                      } else {
                        if (!selectedPrs.includes(item.id)) {
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
