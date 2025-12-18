import {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchCurrentUser} from "../../redux/auth/authOperations";
import DailyCaloriesForm from "../../components/DailyCaloriesForm/DailyCaloriesForm";
import Container from "../../components/Container/Container";
import Modal from "../../components/Modal/Modal";
import DailyCaloriesIntake from "../../components/DailyCaloriesIntake/DailyCaloriesIntake";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import {instance} from "../../services/api";
import styles from "./CalculatorPage.module.css";

const CalculatorPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const endpoint = isLoggedIn
        ? `/daily-rate/user/${values.userId || "0"}`
        : "/daily-rate";
      const {data} = await instance.post(endpoint, values);
      let resultData = null;
      if (isLoggedIn) {
        await dispatch(fetchCurrentUser());
        const userData = data.data.user.userData;
        resultData = {
          dailyRate: userData.dailyRate,
          notAllowedProducts: userData.notAllowedProducts,
        };
      } else {
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
    <section className={styles.calculatorPageSection}>
      <Container>
        <div
          className={`${styles.calculatorPageContent} ${
            isLoggedIn ? styles.loggedIn : ""
          }`}
        >
          <div className={styles.leftSide}>
            <DailyCaloriesForm onFormSubmit={handleSubmit} />

            {isModalOpen && modalData && (
              <Modal onClose={closeModal}>
                <DailyCaloriesIntake data={modalData} onClose={closeModal} />
              </Modal>
            )}
          </div>

          {isLoggedIn && (
            <div className={styles.rightSide}>
              <RightSideBar />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CalculatorPage;
