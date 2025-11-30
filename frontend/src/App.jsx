import { useEffect } from 'react'; // Eklendi
import { useSelector } from 'react-redux'; // Eklendi
import { setToken } from './services/api'; // api.js'den import et
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import CalculatorPage from './pages/CalculatorPage/CalculatorPage';
import DiaryPage from './pages/DiaryPage/DiaryPage';

function App() {
  // Redux'tan token'ı al
  const token = useSelector((state) => state.auth.token);

  // Sayfa yüklendiğinde token varsa Axios'a yapıştır
  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/diary" element={<DiaryPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;