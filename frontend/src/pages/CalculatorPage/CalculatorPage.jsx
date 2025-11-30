import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // useDispatch EKLENDİ
import { fetchCurrentUser } from '../../redux/auth/authOperations'; // YENİ IMPORT
import DailyCaloriesForm from '../../components/DailyCaloriesForm/DailyCaloriesForm';
import Container from '../../components/Container/Container';
import Modal from '../../components/Modal/Modal';
import DailyCaloriesIntake from '../../components/DailyCaloriesIntake/DailyCaloriesIntake';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import { instance } from '../../services/api';
import styles from './CalculatorPage.module.css'; 

const CalculatorPage = () => {
  const dispatch = useDispatch(); // Dispatch tanımla
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // --- SAYFA YÜKLENİNCE VERİLERİ TAZELE ---
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isLoggedIn]);

  const handleSubmit = async (values) => {
    try {
      // Eğer login ise kullanıcıya özel hesaplama (ve kaydetme) endpointi
      // Değilse public hesaplama endpointi
      const endpoint = isLoggedIn ? `/daily-rate/user/${values.userId || '0'}` : '/daily-rate';
      
      const { data } = await instance.post(endpoint, values);
      
      // Gelen veriyi modala hazırla
      // NOT: Backend yapısına göre değişebilir. 
      // Login ise: data.data.user.userData içinde olabilir
      // Public ise: data.data içinde olabilir
      
      let resultData = null;

      if (isLoggedIn) {
          // Login ise Backend tüm user objesini döner, içinden userData'yı alalım
          // Ve en önemlisi: REDUX'I GÜNCELLEMELİYİZ!
          // Bunun için tekrar fetchCurrentUser çağırabiliriz
          await dispatch(fetchCurrentUser());
          
          // Modale göstereceğimiz veriyi hazırlayalım
          const userData = data.data.user.userData;
          resultData = {
              dailyRate: userData.dailyRate,
              notAllowedProducts: userData.notAllowedProducts
          };
      } else {
          // Public ise direkt hesaplama sonucunu döner
          resultData = data.data;
      }

      setModalData(resultData);
      setIsModalOpen(true);

    } catch (error) {
      console.error("Hesaplama hatası:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <DailyCaloriesForm onFormSubmit={handleSubmit} />

        {isModalOpen && modalData && (
          <Modal onClose={closeModal}>
            <DailyCaloriesIntake data={modalData} onClose={closeModal} />
          </Modal>
        )}
      </Container>

      {/* RightSideBar verileri artık Redux'tan otomatik alacak */}
      {isLoggedIn && <RightSideBar />}
      
    </div>
  );
};

export default CalculatorPage;