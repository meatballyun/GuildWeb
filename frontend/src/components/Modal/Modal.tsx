import { createPortal } from 'react-dom';
import { classNames } from '../../utils';
import { MaterialSymbol } from '../MaterialSymbol';
import './styles.css';
import { forwardRef, useEffect, useRef } from 'react';
import { Button, ButtonProps } from '../Button';

interface FootButtonProps extends ButtonProps {
  children: string;
}

export interface ModalContentProps {
  onClose?: (value?: boolean) => void;
  hideCloseButton?: boolean;
  header?: React.ReactNode;
  children?: React.ReactNode;
  contentClassName?: string;
  footButton?: FootButtonProps[];
  size?: 'sm' | 'md' | 'lg';
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (
    {
      onClose,
      hideCloseButton,
      header,
      children,
      contentClassName,
      footButton,
      size = 'md',
    },
    ref
  ) => {
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className={`modal ${size}`} ref={ref}>
            <div className="w-full border-b-2 border-primary-200/30 p-2 text-center">
              <span className="text-heading-h2 text-primary-600">{header}</span>
              {!hideCloseButton && (
                <MaterialSymbol
                  className="float-right mt-1 cursor-pointer"
                  icon="close"
                  onClick={() => onClose?.()}
                />
              )}
            </div>
            <div className={classNames('modal-content', contentClassName)}>
              {children}
            </div>
            {footButton && (
              <div className="flex gap-2 border-t-2 border-primary-200/30 p-2">
                {footButton.map((props, i) => (
                  <Button
                    className="w-full justify-center"
                    {...props}
                    key={(props.children as string) ?? i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export interface ModalProps extends ModalContentProps {
  isOpen?: boolean;
  allowCloseOutside?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  hideCloseButton,
  header,
  children,
  contentClassName,
  footButton,
  allowCloseOutside,
  size,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!allowCloseOutside) return;

    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current?.contains(e.target as Node)) return;
      onClose?.(false);
    };
    window.addEventListener('click', clickHandler);
    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, [allowCloseOutside]);

  if (!isOpen) return null;

  return createPortal(
    <ModalContent
      ref={modalRef}
      size={size}
      onClose={onClose}
      hideCloseButton={hideCloseButton}
      header={header}
      children={children}
      contentClassName={contentClassName}
      footButton={footButton}
    />,
    document.body
  );
};
