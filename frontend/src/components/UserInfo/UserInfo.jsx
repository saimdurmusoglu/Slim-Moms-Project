import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../redux/auth/authOperations";
import Modal from "../../components/Modal/Modal";
import styles from "./UserInfo.module.css";

const UserInfo = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.user.name) || "User";

  const handleLogoutConfirm = () => {
    dispatch(logOut());
    navigate("/login");
    setIsLogoutModalOpen(false);
  };

  return (
    <div className={styles.userInfoBox}>
      <span className={styles.name}>{name}</span>
      <button
        type="button"
        onClick={() => setIsLogoutModalOpen(true)}
        className={styles.exitBtn}
        title="Log out from the application"
      >
        Exit
      </button>

      {isLogoutModalOpen && (
        <Modal onClose={() => setIsLogoutModalOpen(false)}>
          <div className={styles.logoutModalContent}>
            <h2 className={styles.modalTitle}>Logout</h2>
            <p className={styles.modalText}>Are you sure you want to log out?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmBtn} onClick={handleLogoutConfirm}>
                Log out
              </button>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserInfo;