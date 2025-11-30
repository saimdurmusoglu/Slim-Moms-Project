import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/auth/authOperations';
import Container from '../../components/Container/Container';
import styles from './RegistrationPage.module.css';

// Validasyon Kuralları
const validationSchema = Yup.object({
  name: Yup.string().min(3, 'En az 3 karakter').required('Zorunlu alan'),
  email: Yup.string().email('Geçersiz email').required('Zorunlu alan'),
  password: Yup.string().min(6, 'En az 6 karakter').required('Zorunlu alan'),
});

const RegistrationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (values, { resetForm }) => {
    dispatch(register(values)).then((result) => {
      // Kayıt başarılıysa Login sayfasına yönlendir
      if (!result.error) {
        resetForm();
        navigate('/login');
      }
    });
  };

  return (
    <Container>
      {/* Header'ı buradan kaldırdık çünkü App.jsx içinde genel olarak ekledik */}
      
      <div className={styles.content}>
        <h3 className={styles.title}>REGISTER</h3>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {() => (
            <Form className={styles.form}>
              
              {/* Name Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="name">Name *</label>
                <Field 
                  type="text" 
                  name="name" 
                  className={styles.input} 
                />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>

              {/* Email Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email *</label>
                <Field 
                  type="email" 
                  name="email" 
                  className={styles.input} 
                />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>

              {/* Password Input */}
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">Password *</label>
                <Field 
                  type="password" 
                  name="password" 
                  className={styles.input} 
                />
                <ErrorMessage name="password" component="div" className={styles.error} />
              </div>

              {/* Butonlar */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Register
                </button>
                
                <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Log in
                </Link>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default RegistrationPage;