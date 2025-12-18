import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logOut} from "../../redux/auth/authOperations";
import styles from "./UserInfo.module.css";

const UserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const name = useSelector((state) => state.auth.user.name) || "User";

  const onLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      dispatch(logOut());
      navigate("/login");
    }
  };

  return (
    <div className={styles.userInfoBox}>
      <span className={styles.name}>{name}</span>
      <button
        type="button"
        onClick={onLogout}
        className={styles.exitBtn}
        title="Log out from the application"
      >
        Exit
      </button>
    </div>
  );
};

export default UserInfo;
