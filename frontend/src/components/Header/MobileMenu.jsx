import {NavLink} from "react-router-dom";
import styles from "./MobileMenu.module.css";

const MobileMenu = ({onClose}) => {
  // --- YENİ EKLENEN FONKSİYON ---
  // Kullanıcı gri alana (overlay) tıklarsa menüyü kapat.
  // Ama beyaz kutuya (menuContainer) tıklarsa kapatma.
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.menuContainer}>
        <div className={styles.menuLinks}>
          <NavLink
            to="/diary"
            className={({isActive}) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            onClick={onClose}
          >
            DIARY
          </NavLink>

          <NavLink
            to="/calculator"
            className={({isActive}) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
            onClick={onClose}
          >
            CALCULATOR
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
