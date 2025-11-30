import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate EKLE
import { logOut } from '../../redux/auth/authOperations';
import Container from '../Container/Container';
import styles from './UserInfo.module.css';

const UserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. Hook'u Çağır
  const name = useSelector((state) => state.auth.user.name) || 'User';

  const onLogout = () => {
    dispatch(logOut());
    navigate('/login'); // 3. Çıkış yapınca Login'e git
  };

  return (
    <div className={styles.userInfoBar}>
      <Container>
        <div className={styles.content}>
            <div className={styles.rightSide}>
                <span className={styles.name}>{name}</span>
                {/* <span className={styles.separator}>|</span> */}
                <button type="button" onClick={onLogout} className={styles.exitBtn}>
                    Exit
                </button>
            </div>
        </div>
      </Container>
    </div>
  );
};

export default UserInfo;