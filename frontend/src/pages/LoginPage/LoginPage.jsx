import {useDispatch} from "react-redux";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {logIn} from "../../redux/auth/authOperations";
import Container from "../../components/Container/Container";
import styles from "./LoginPage.module.css";

const validationSchema = Yup.object({
  email: Yup.string().email("Geçersiz email").required("Zorunlu alan"),
  password: Yup.string().min(6, "En az 6 karakter").required("Zorunlu alan"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (values, {resetForm}) => {
    dispatch(logIn(values)).then((result) => {
      if (result.type === "auth/login/fulfilled") {
        resetForm();
        navigate("/calculator");
      }
    });
  };

  return (
    <section className={styles.authSection}>
      <Container>
        <div className={styles.loginSection}>
          <div className={styles.content}>
            <h3 className={styles.title}>LOG IN</h3>

            <Formik
              initialValues={{email: "", password: ""}}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {() => (
                <Form className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">
                      Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="password">
                      Password *
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className={styles.input}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className={styles.error}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                    >
                      Log in
                    </button>

                    <Link
                      to="/register"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Register
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LoginPage;
