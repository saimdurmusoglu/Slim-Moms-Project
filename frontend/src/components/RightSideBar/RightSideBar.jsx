import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { instance } from '../../services/api';
import styles from './RightSideBar.module.css';
import Container from '../Container/Container';

// PROP İSMİNİ DEĞİŞTİRDİK: 'consumed' yerine 'propConsumed' yaptık
const RightSideBar = ({ consumed: propConsumed }) => {
  const userData = useSelector((state) => state.auth.user.userData) || {};
  const { dailyRate = 0, notAllowedProducts = [] } = userData;
  const token = useSelector((state) => state.auth.token);

  // Kendi içindeki state (Calculator sayfasında lazım olacak)
  const [fetchedConsumed, setFetchedConsumed] = useState(0);

  // Hangi değeri kullanacağız?
  // Eğer propConsumed (Diary'den gelen) varsa onu kullan, yoksa fetchedConsumed (API'den gelen) kullan.
  // Not: propConsumed 0 olabilir, o yüzden undefined kontrolü yapıyoruz.
  const finalConsumed = propConsumed !== undefined ? propConsumed : fetchedConsumed;

  // Hesaplamalar
  const left = dailyRate - finalConsumed;
  const percent = dailyRate ? Math.round((finalConsumed / dailyRate) * 100) : 0;
  const isOverLimit = left < 0; 

  const today = new Date();
  const dateString = today.toLocaleDateString('en-GB').replace(/\//g, '.');

  // --- API İSTEĞİ (Sadece Calculator Sayfası İçin) ---
  useEffect(() => {
    // Eğer propConsumed zaten varsa (Diary sayfası), boşuna API isteği atma!
    if (propConsumed !== undefined) return;

    const fetchDailySummary = async () => {
        if (!token) return;
        try {
            const todayDate = new Date();
            const offset = todayDate.getTimezoneOffset();
            const date = new Date(todayDate.getTime() - (offset * 60 * 1000));
            const formattedDate = date.toISOString().split('T')[0];

            const { data } = await instance.post('/diary/day', { date: formattedDate });
            
            if (data.data && data.data.products) {
                const total = data.data.products.reduce((acc, item) => acc + item.calories, 0);
                setFetchedConsumed(total);
            } else {
                setFetchedConsumed(0);
            }
        } catch (error) {
            console.error("Özet çekilemedi:", error);
        }
    };

    fetchDailySummary();
  }, [token, propConsumed]); // propConsumed değişirse effect'i tekrar kontrol et

  return (
    <div className={styles.sidebar}>
      <Container>
        <div className={styles.content}>
            
          <div className={styles.summarySection}>
            <h3 className={styles.title}>Summary for {dateString}</h3>
            
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span>Left</span>
                <span className={isOverLimit ? styles.textRed : ''}>{left} kcal</span>
              </li>
              <li className={styles.listItem}>
                <span>Consumed</span>
                {/* FINAL DEĞERİ KULLANIYORUZ */}
                <span>{finalConsumed} kcal</span>
              </li>
              <li className={styles.listItem}>
                <span>Daily rate</span>
                <span>{dailyRate} kcal</span>
              </li>
              <li className={styles.listItem}>
                <span>n% of normal</span>
                <span className={isOverLimit ? styles.textRed : ''}>{percent} %</span>
              </li>
            </ul>
          </div>

          <div className={styles.foodSection}>
            <h3 className={styles.title}>Food not recommended</h3>
            {notAllowedProducts.length > 0 ? (
              <ol className={styles.foodList}>
                {notAllowedProducts.map((item, index) => (
                  <li key={index} className={styles.foodItem}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className={styles.placeholder}>Your diet will be displayed here</p>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};

export default RightSideBar;