import * as React from 'react';

type MapProps<Item> = {
  items: Item[];
  renderItem: (item: Item, index: number) => JSX.Element;
};

export const Map = function<Item>({
  items,
  renderItem,
}: MapProps<Item>): JSX.Element {
  return (
    <React.Fragment>
      {items.map(renderItem)}
    </React.Fragment>
  );
};
