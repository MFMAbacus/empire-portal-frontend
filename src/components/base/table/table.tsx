import * as React from "react";

import cls from "./table.module.scss";

import { clsx } from "@/utility/clsx";

enum TableAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

type TableProps = {
  head?: React.ReactNode;
  body?: React.ReactNode;
};

type TableComponent = {
  (props: TableProps): JSX.Element;
  Align: typeof TableAlign;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
};

export const Table: TableComponent = ({
  head,
  body,
}: TableProps): JSX.Element => {
  return (
    <table className={cls["table"]}>
      <thead>{head}</thead>
      <tbody>{body}</tbody>
    </table>
  );
};

type TableRowProps = {
  children?: React.ReactNode;
  className?: string;
};

export const TableRow = ({
  children,
  className,
}: TableRowProps): JSX.Element => {
  return <tr className={`${className} ${cls["table__row"]}`}>{children}</tr>;
};

type TableHeaderProps = {
  value?: string;
  align?: TableAlign;
  className?: string;
};

export const TableHeader = ({
  value,
  align = TableAlign.LEFT,
  className,
}: TableHeaderProps): JSX.Element => {
  const rootCls = clsx([
    cls["table__header"],
    cls[`table__header--${align}`],
    className,
  ]);

  return <th className={rootCls}>{value}</th>;
};

type TableCellProps = {
  align?: TableAlign;
  children?: React.ReactNode;
  className?: string;
};

export const TableCell = ({
  align = TableAlign.LEFT,
  children,
  className,
}: TableCellProps): JSX.Element => {
  const rootCls = clsx([
    cls["table__cell"],
    cls[`table__cell--${align}`],
    className,
  ]);

  return <td className={rootCls}>{children}</td>;
};

Table.Align = TableAlign;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;
