import * as React from 'react';

import {Portal} from '@/components/base/portal';

import cls from './modal.module.scss';
import {clsx} from '@/utility/clsx';

type ModalComponent = {
  (props: ModalProps): JSX.Element;
  Footer: typeof ModalFooter;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
};

type ModalProps = {
  children?: React.ReactNode;
  isLong?: boolean;
};

export const Modal: ModalComponent = ({
  children,
  isLong,
}: ModalProps): JSX.Element => {
  const rootCls = clsx([
    cls['modal'],
    isLong && cls['modal--is-long'],
  ]);

  return (
    <Portal root='popups'>
      <div className={rootCls}>
        <div className={cls['modal__box']}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

type ModalHeaderProps = {
  title: string;
};

export const ModalHeader = ({
  title,
}: ModalHeaderProps): JSX.Element => {
  return (
    <div className={cls['modal__header']}>
      {title}
    </div>
  );
};

type ModalBodyProps = {
  children?: React.ReactNode;
};

export const ModalBody = ({
  children,
}: ModalBodyProps): JSX.Element => {
  return (
    <div className={cls['modal__body']}>
      {children}
    </div>
  );
};

type ModalFooterProps = {
  children?: React.ReactNode;
};

export const ModalFooter = ({
  children,
}: ModalFooterProps): JSX.Element => {
  return (
    <div className={cls['modal__footer']}>
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;
Modal.Body = ModalBody;
