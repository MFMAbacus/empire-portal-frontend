import * as React from 'react';

import cls from './currency.module.scss';

type CurrencyProps = {
  value: number;
};

export const Currency = (props: CurrencyProps): JSX.Element => {
  return (
    <span className={cls['currency']}>
      {formatDecimal(props.value)}
    </span>
  );
};

const formatDecimal = (decimal: number): string => {
  return (Math.round(decimal * 100) / 100).toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
