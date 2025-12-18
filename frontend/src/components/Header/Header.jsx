import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import Navigation from "./Navigation";
import UserInfo from "../UserInfo/UserInfo";
import styles from "./Header.module.css";

import logoMobile from "../../assets/icons/logo_mobile.svg";
import logoMobileLogin from "../../assets/icons/logo_mobile_login.svg";
import logoTablet from "../../assets/icons/logo_tablet.svg";
import logoDesktop from "../../assets/icons/logo_desktop.svg";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerContent}>
          <Link
            to={isLoggedIn ? "/diary" : "/"}
            className={styles.logoContainer}
            aria-label="Slim Mom Home"
          >
            <picture>
              <source media="(min-width: 1280px)" srcSet={logoDesktop} />
              <source media="(min-width: 768px)" srcSet={logoTablet} />
              <img
                src={isLoggedIn ? logoMobileLogin : logoMobile}
                alt="Slim Mom Logo"
                fetchPriority="high"
                loading="eager"
                width="44"
                height="44"
              />
            </picture>
          </Link>

          <div
            className={`
                ${styles.navigationWrapper} 
                ${isLoggedIn ? styles.navLoggedIn : styles.navLoggedOut}
              `}
          >
            <Navigation />
          </div>

          {isLoggedIn && (
            <div className={styles.userInfoDesktopWrapper}>
              <UserInfo />
            </div>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className={styles.userInfoMobileBar}>
          <UserInfo />
        </div>
      )}
    </header>
  );
};

export default Header;
