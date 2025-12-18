import {useEffect} from "react";
import {createPortal} from "react-dom";
import styles from "./Modal.module.css";
import CloseIcon from "../../assets/icons/menu-close.svg?react";

const modalRoot = document.getElementById("modal-root") || document.body;

const Modal = ({onClose, children}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <CloseIcon width="14" height="14" />
        </button>

        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
