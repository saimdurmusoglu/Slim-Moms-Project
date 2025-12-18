import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import styles from "./Navigation.module.css";
import MenuIcon from "../../assets/icons/menu.svg?react";
import CloseIcon from "../../assets/icons/menu-close.svg?react";
import MobileMenu from "./MobileMenu";

const Navigation = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getNavLinkClass = ({isActive}) =>
    isActive ? styles.activeLink : styles.navLink;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className={styles.navContainer}>
        {isLoggedIn ? (
          <>
            <div className={styles.desktopMenu}>
              <span className={styles.separator}>|</span>
              <NavLink to="/diary" className={getNavLinkClass}>
                DIARY
              </NavLink>
              <NavLink to="/calculator" className={getNavLinkClass}>
                CALCULATOR
              </NavLink>
            </div>

            <button
              type="button"
              className={styles.menuBtn}
              onClick={toggleMenu}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
            >
              {isMenuOpen ? (
                <CloseIcon width="24" height="24" />
              ) : (
                <MenuIcon width="24" height="24" />
              )}
            </button>
          </>
        ) : (
          <div className={styles.authMenu}>
            <span className={styles.separator}>|</span>

            <NavLink to="/login" className={getNavLinkClass}>
              LOG IN
            </NavLink>

            <NavLink to="/register" className={getNavLinkClass}>
              REGISTRATION
            </NavLink>
          </div>
        )}
      </nav>

      {isLoggedIn && isMenuOpen && <MobileMenu onClose={toggleMenu} />}
    </>
  );
};

export default Navigation;
