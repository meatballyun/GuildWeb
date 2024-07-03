import { createPortal } from 'react-dom';
import { ModalContent, ModalProps } from './Modal';
import React, { useState } from 'react';

function* infinite() {
  let index = 1;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    yield (index += 1);
  }
}

const generator = infinite();

interface BasicPromptDialogProps extends Omit<ModalProps, 'children'> {
  description?: React.ReactNode;
}

const BasicPromptDialog = ({
  onClose,
  footButton,
  description,
  ...props
}: BasicPromptDialogProps) => {
  return (
    <ModalContent
      size="sm"
      footButton={footButton?.map(({ onClick, ...buttonProps }) => ({
        onClick: () => {
          onClick?.();
          onClose?.();
        },
        ...buttonProps,
      }))}
      {...props}
      onClose={onClose}
    >
      <div className="flex min-h-[80px] flex-col items-center justify-center whitespace-pre-wrap text-center text-paragraph-p3">
        {description}
      </div>
    </ModalContent>
  );
};

export const useDialog = () => {
  const [show, setShow] = useState(false);
  const [dialogProps, setDialogProps] = useState<{
    props: BasicPromptDialogProps;
    key: string;
    onHide?: () => void;
  }>({ props: {}, key: '' });

  const handleClose = () => {
    setShow(false);
    dialogProps?.onHide?.();
  };
  const promptDialog = ({
    onHide,
    ...props
  }: BasicPromptDialogProps & {
    onHide?: () => void;
  }) => {
    const key = generator.next().value;
    setDialogProps({ props, key: `${key}` });
    setShow(true);
  };

  return {
    promptDialog,
    dialog:
      show &&
      createPortal(
        <BasicPromptDialog
          key={`${dialogProps.key}`}
          onClose={handleClose}
          {...dialogProps.props}
        />,
        document.body
      ),
  };
};
