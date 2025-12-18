import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import styles from "./DailyCaloriesForm.module.css";

const validationSchema = Yup.object({
  height: Yup.number().min(100).max(250).required("Required"),
  age: Yup.number().min(18).max(100).required("Required"),
  currentWeight: Yup.number().min(20).max(500).required("Required"),
  desiredWeight: Yup.number().min(20).max(500).required("Required"),
  bloodType: Yup.number().required("Required"),
});

const DailyCaloriesForm = ({onFormSubmit}) => {
  const initialValues = {
    height: "",
    age: "",
    currentWeight: "",
    desiredWeight: "",
    bloodType: 1,
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        Calculate your daily calorie <br />
        intake right now
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onFormSubmit({...values, bloodType: Number(values.bloodType)});
        }}
      >
        {({values}) => (
          <Form className={styles.form}>
            <div className={styles.inputsWrapper}>
              <div className={styles.column}>
                <div className={styles.inputGroup}>
                  <label htmlFor="height" className={styles.label}>
                    Height *
                  </label>
                  <Field
                    type="number"
                    name="height"
                    id="height"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="height"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="age" className={styles.label}>
                    Age *
                  </label>
                  <Field
                    type="number"
                    name="age"
                    id="age"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className={styles.error}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="currentWeight" className={styles.label}>
                    Current weight *
                  </label>
                  <Field
                    type="number"
                    name="currentWeight"
                    id="currentWeight"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="currentWeight"
                    component="div"
                    className={styles.error}
                  />
                </div>
              </div>

              <div className={styles.column}>
                <div className={styles.inputGroup}>
                  <label htmlFor="desiredWeight" className={styles.label}>
                    Desired weight *
                  </label>
                  <Field
                    type="number"
                    name="desiredWeight"
                    id="desiredWeight"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="desiredWeight"
                    component="div"
                    className={styles.error}
                  />
                </div>

                <div className={styles.radioGroupWrapper}>
                  <div className={styles.label} id="blood-group-label">
                    Blood type *
                  </div>

                  <div
                    role="group"
                    aria-labelledby="blood-group-label"
                    className={styles.radioGroup}
                  >
                    {[1, 2, 3, 4].map((type) => (
                      <label key={type} className={styles.radioLabel}>
                        <Field
                          type="radio"
                          name="bloodType"
                          value={String(type)}
                          className={styles.radioInput}
                        />
                        <span className={styles.radioCustom}></span>
                        <span
                          className={
                            Number(values.bloodType) === type
                              ? styles.radioTextActive
                              : styles.radioText
                          }
                        >
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Start losing weight
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DailyCaloriesForm;
