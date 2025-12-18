import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import styles from "./DailyCaloriesIntake.module.css";
import ReturnIcon from "../../assets/icons/return-left.svg?react";

const DailyCaloriesIntake = ({data, onClose}) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const pathToRedirect = isLoggedIn ? "/diary" : "/register";

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBar}>
        <button type="button" className={styles.backBtn} onClick={onClose}>
          <ReturnIcon width="18" height="12" />
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

        <Link to={pathToRedirect} className={styles.btn}>
          Start losing weight
        </Link>
      </div>
    </div>
  );
};

export default DailyCaloriesIntake;
