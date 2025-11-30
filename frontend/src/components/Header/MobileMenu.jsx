import { NavLink } from 'react-router-dom';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.menuContainer}>
        {/* Linkler */}
        <div className={styles.menuLinks}>
          <NavLink 
            to="/diary" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
            onClick={onClose}
          >
            DIARY
          </NavLink>
          
          <NavLink 
            to="/calculator" 
            className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
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