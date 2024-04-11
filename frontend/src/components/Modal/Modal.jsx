import { MaterialSymbol } from '../MaterialSymbol';
import './styles.css';
export const Modal = ({ isOpen, onClose, header, children, footButton }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal">
          <div className="flex w-full items-center justify-between border-b-2 border-primary-200/30 p-2 text-center">
            <span />
            <span className="text-heading-h2">{header}</span>
            <MaterialSymbol
              className="cursor-pointer"
              icon="close"
              onClick={() => onClose?.()}
            />
          </div>
          <div className="modal-content">{children}</div>
          {footButton && (
            <div className="border-t-2 border-primary-200/30 p-2">
              {footButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
