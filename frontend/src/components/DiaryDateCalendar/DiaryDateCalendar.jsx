import {forwardRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DiaryDateCalendar.module.css";
import CalendarIcon from "../../assets/icons/calendar.svg?react";

const CustomInput = forwardRef(({value, onClick}, ref) => (
  <div className={styles.dateWrapper} onClick={onClick} ref={ref}>
    <span className={styles.dateText}>{value}</span>
    <CalendarIcon className={styles.icon} width="20" height="20" />
  </div>
));

CustomInput.displayName = "CustomInput";

const DiaryDateCalendar = ({selectedDate, setSelectedDate}) => {
  return (
    <div className={styles.container}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        customInput={<CustomInput />}
        popperPlacement="bottom-start"
      />
    </div>
  );
};

export default DiaryDateCalendar;
