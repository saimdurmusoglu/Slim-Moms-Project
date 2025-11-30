import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 1. useSelector EKLENDİ
import styles from './DailyCaloriesIntake.module.css';
import returnIcon from '../../assets/icons/return-left.svg';

const DailyCaloriesIntake = ({ data, onClose }) => {
  // 2. Kullanıcı giriş yapmış mı kontrol et
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 3. Yönlenecek adresi belirle
  const pathToRedirect = isLoggedIn ? '/diary' : '/register';

  return (
    <div className={styles.wrapper}>
      
      <div className={styles.headerBar}>
         <button type="button" className={styles.backBtn} onClick={onClose}>
            <img src={returnIcon} alt="Go back" />
         </button>
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>
          Your recommended daily calorie intake is
        </h2>

        <div className={styles.resultWrapper}>
          <span className={styles.calories}>{data.dailyRate}</span>
          <span className={styles.unit}>kcal</span>
        </div>

        <div className={styles.listWrapper}>
          <h3 className={styles.listTitle}>Foods you should not eat</h3>
          
          <ol className={styles.list}>
            {data.notAllowedProducts.map((item, index) => (
              <li key={index} className={styles.listItem}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </div>

        {/* 4. Link Adresini Dinamik Yap */}
        <Link to={pathToRedirect} className={styles.btn}>
          Start losing weight
        </Link>
      </div>
    </div>
  );
};

export default DailyCaloriesIntake;