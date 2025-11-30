import { forwardRef } from 'react'; // useState silindi, forwardRef kaldı
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './DiaryDateCalendar.module.css';
import calendarIcon from '../../assets/icons/calendar.svg';

// DÜZELTME: CustomInput artık ana bileşenin DIŞINDA
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className={styles.dateWrapper} onClick={onClick} ref={ref}>
    <span className={styles.dateText}>{value}</span>
    <img src={calendarIcon} alt="Calendar" className={styles.icon} />
  </div>
));

// Bu satır React dev tools'ta component adının düzgün görünmesi için iyidir (Opsiyonel ama önerilir)
CustomInput.displayName = 'CustomInput';

const DiaryDateCalendar = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className={styles.container}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        customInput={<CustomInput />}

        // --- DÜZELTME BURADA ---
        // Takvimin sol kenarını, inputun sol kenarı ile hizala (Sola taşmasını engeller)
        popperPlacement="bottom-start"
      />
    </div>
  );
};

export default DiaryDateCalendar;