import { createPortal } from 'react-dom';
import { ModalContent } from './Modal';
import { useState } from 'react';

function* infinite() {
  let index = 1;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    yield (index += 1);
  }
}
const generator = infinite();

const BasicPromptDialog = ({
  show,
  onClose,
  footButton,
  description,
  ...props
}) => {
  return (
    <ModalContent
      size="sm"
      allowCloseOutside
      footButton={footButton?.map(
        ({ isCloseModal, onClick, ...buttonProps }) => ({
          onClick: () => {
            onClick?.();
            onClose?.();
          },
          className: 'w-full justify-center',
          ...buttonProps,
        })
      )}
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
  const [dialogProps, setDialogProps] = useState({});

  const handleClose = () => {
    setShow(false);
    dialogProps?.onHide?.();
  };
  const promptDialog = ({ onHide, ...props }) => {
    const key = generator.next().value;
    setDialogProps({ props, key });
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
