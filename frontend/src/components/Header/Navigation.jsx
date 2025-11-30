import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import menuIcon from '../../assets/icons/menu.svg';
import closeIcon from '../../assets/icons/menu-close.svg';
import MobileMenu from './MobileMenu';

const Navigation = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className={styles.nav}>
        {isLoggedIn ? (
          /* --- LOGIN OLMUŞSA: SADECE BURGER MENÜ --- */
          <div className={styles.userInfo}>             
             <button type="button" className={styles.menuBtn} onClick={toggleMenu}>
               <img src={isMenuOpen ? closeIcon : menuIcon} alt="Menu" />
             </button>
          </div>
        ) : (
          /* --- LOGIN OLMAMIŞSA: LOG IN | REGISTRATION --- */
          <div className={styles.authNav}>
            <NavLink 
              to="/login" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
            >
              LOG IN
            </NavLink>
            {/* <span className={styles.separator}>|</span> */}
            <NavLink 
              to="/register" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
            >
              REGISTRATION
            </NavLink>
          </div>
        )}
      </nav>

      {isLoggedIn && isMenuOpen && (
        <MobileMenu onClose={toggleMenu} />
      )}
    </>
  );
};

export default Navigation;