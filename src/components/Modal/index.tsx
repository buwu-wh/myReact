import { createPortal } from 'react-dom';
import style from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isClickModelClose?: boolean;
}
function Modal({
  isOpen,
  onClose,
  children,
  isClickModelClose = false,
}: ModalProps) {
  if (!isOpen) return null;

  // 将模态框渲染到 body 下，脱离当前 DOM 层级
  return createPortal(
    <div
      className={style['modal-overlay']}
      onClick={() => {
        if (isClickModelClose) {
          onClose();
        }
      }}
    >
      <div
        className={style['modal-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={style['modal-close']} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
