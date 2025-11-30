import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../Container/Container';
import Navigation from './Navigation';
import UserInfo from '../UserInfo/UserInfo';
import styles from './Header.module.css';

import logoMobile from '../../assets/icons/logo-mobile.svg';
import logoTablet from '../../assets/icons/logo-tablet.svg';
import logoDesktop from '../../assets/icons/logo-desktop.svg';

const Header = () => {
  // Redux'taki isLoggedIn değerini anlık dinliyoruz
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className={styles.headerWrapper}>
      
      <header className={styles.header}>
        <Container>
          <div className={styles.headerContent}>
            
            <Link to="/" className={styles.logoContainer}>
              <picture>
                <source media="(min-width: 1280px)" srcSet={logoDesktop} />
                <source media="(min-width: 768px)" srcSet={logoTablet} />
                <img src={logoMobile} alt="Slim Moms Logo" />
              </picture>

              {/* Login ise yazıyı göster */}
              {isLoggedIn && (
                <span className={styles.logoText}>
                  <span className={styles.textSlim}>Slim</span>
                  <span className={styles.textMom}>Mom</span>
                </span>
              )}
            </Link>

            <Navigation />
          </div>
        </Container>
      </header>

      {/* --- KRİTİK NOKTA --- */}
      {/* isLoggedIn false olunca burası DOM'dan tamamen silinir */}
      {isLoggedIn && <UserInfo />}
      
    </div>
  );
};

export default Header;