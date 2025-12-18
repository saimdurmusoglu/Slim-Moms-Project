import {useEffect, lazy, Suspense} from "react"; // lazy ve Suspense eklendi
import {useSelector, useDispatch} from "react-redux";
import {Routes, Route} from "react-router-dom";
import {fetchCurrentUser} from "./redux/auth/authOperations";
import {setToken} from "./services/api";

import Container from "./components/Container/Container";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";
import styles from "./App.module.css";

const RegistrationPage = lazy(() =>
  import("./pages/RegistrationPage/RegistrationPage")
);
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const CalculatorPage = lazy(() =>
  import("./pages/CalculatorPage/CalculatorPage")
);
const DiaryPage = lazy(() => import("./pages/DiaryPage/DiaryPage"));

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isRefreshing = useSelector((state) => state.auth.isRefreshing);
  const isAuthLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    if (token) {
      setToken(token);
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  if (isRefreshing) {
    return <Loader />;
  }

  return (
    <Container>
      {isAuthLoading && <Loader />}
      <div className={styles.appWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<CalculatorPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/diary" element={<DiaryPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Container>
  );
}

export default App;
