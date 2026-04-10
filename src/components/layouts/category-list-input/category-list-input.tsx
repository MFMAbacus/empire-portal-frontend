import * as React from 'react';

import {Category} from '@/types/category';

import {Map} from '@/components/base/map';

import {ListInput} from '@/components/base/list-input';

import {useForm} from '@/hooks/use-form';

import {makeGetCategoriesService} from '@/services/get-categories-service';

type CategoryListInputProps = {
  sessionId: string;
  categoryId: string | null;
  feedback?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  className?: string;
  onChange: (categoryId: string | null) => void;
};

export const CategoryListInput = (props: CategoryListInputProps): JSX.Element => {
  const {
    sessionId,
    categoryId,
    feedback,
    isDisabled = false,
    hasError = false,
    className,
    onChange,
  } = props;

  const [
    categories,
    setCategories,
  ] = React.useState<Category[] | null>(null);

  const currentCategories = React.useMemo<Category[] | null>(() => {
    if (categories === null) {
      return null;
    }
    return categories.filter((current) => {
      return current.parentCategoryId === categoryId;
    });
  }, [
    categoryId,
    categories,
  ]);

  const handleSuccess = React.useCallback((data: unknown) => {
    const categories = data as Category[];
    setCategories(categories);
  }, []);

  const {
    isLoading,
    submit,
  } = useForm({
    isLoadingDefault: true,
    serviceMaker: makeGetCategoriesService,
    onSuccess: handleSuccess,
  });

  const loadCategories = React.useCallback(() => {
    setCategories(null);
    submit({
      sessionId,
    });
  }, [
    sessionId,
    submit,
  ]);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const value = React.useMemo(() => {
    if (isLoading) {
      return 'None';
    }
    if (categories === null) {
      return 'None';
    }
    const foundCategory = categories.find((category) => {
      return category.id === categoryId;
    });
    if (typeof foundCategory !== 'undefined') {
      return foundCategory.title;
    }

    return 'None';
  }, [
    categoryId,
    isLoading,
    categories,
  ]);

  return (
    <ListInput
      className={className}
      label='Category'
      value={value}
      feedback={feedback}
      placeholder='Select Category'
      hasError={hasError}
      isRequired
      isDisabled={isDisabled || isLoading}>
      {categoryId !== null && (
        <ListInput.Item
          label='[Reset]'
          onClick={() => {
            onChange(null);
          }}
        />
      )}
      {(!isLoading && currentCategories !== null) && (
        <Map
          items={currentCategories}
          renderItem={(item) => {
            return (
              <ListInput.Item
                label={item.title}
                onClick={() => {
                  onChange(item.id);
                }}
                isActive={item.id === categoryId}
              />
            );
          }}
        />
      )}
    </ListInput>
  );
};
