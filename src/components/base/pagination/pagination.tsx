import * as React from "react";

import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";

import { clsx } from "@/utility/clsx";

import cls from "./pagination.module.scss";

type PaginationProps = {
  page?: number;
  totalPages?: number;
  maxPages?: number;
  onPage?: (page: number) => void;
};

export const Pagination = ({
  page = 1,
  totalPages = 1,
  onPage,
}: PaginationProps): JSX.Element => {
  const items = React.useMemo(() => {
    const result: JSX.Element[] = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let index = startPage; index <= endPage; index++) {
      result.push(
        <PaginationItem
          key={index}
          isActive={page === index}
          onClick={() => onPage && onPage(index)}
        >
          {index}
        </PaginationItem>
      );
    }

    return result;
  }, [page, totalPages, onPage]);

  return (
    <div className={cls["pagination"]}>
      {/* Jump to the first page */}
      <PaginationItem
        isActive={true}
        onClick={() => onPage && page > 1 && onPage(1)}
      >
        {"<<"}
      </PaginationItem>

      {/* Move one page back */}
      <PaginationItem
        isActive={true}
        onClick={() => onPage && page > 1 && onPage(page - 1)}
      >
        <ChevronLeftIcon />
      </PaginationItem>

      {items}

      {/* Move one page forward */}
      <PaginationItem
        isActive={true}
        onClick={() => onPage && page < totalPages && onPage(page + 1)}
      >
        <ChevronRightIcon />
      </PaginationItem>

      {/* Jump to the last page */}
      <PaginationItem
        isActive={true}
        onClick={() => onPage && page < totalPages && onPage(totalPages)}
      >
        {">>"}
      </PaginationItem>
    </div>
  );
};

type PaginationItemProps = {
  isActive?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export const PaginationItem = ({
  isActive = true,
  children,
  onClick,
}: PaginationItemProps): JSX.Element => {
  const rootCls = clsx([cls["item"], isActive && cls["item--is-active"]]);

  return (
    <div className={rootCls} onClick={onClick}>
      {children}
    </div>
  );
};
