import { MaterialSymbol } from '../MaterialSymbol';
import './styles.css';
export const Modal = ({ isOpen, onClose, header, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal">
          <div className="flex w-full items-center justify-between p-2 text-center">
            <span></span>
            <span className="text-heading-h2">{header}</span>
            <MaterialSymbol
              className="cursor-pointer"
              icon="close"
              onClick={() => onClose()}
            />
          </div>
          <div className="modal-content">{children}</div>
        </div>
      </div>
    </div>
  );
};
