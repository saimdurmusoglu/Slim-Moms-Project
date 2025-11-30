import styles from './DiaryProductListItem.module.css';
import closeIcon from '../../assets/icons/close.svg';
import editIcon from '../../assets/icons/edit.svg'; // Bu dosyanın var olduğundan emin ol

const DiaryProductListItem = ({ product, onDelete, onEdit }) => {
  return (
    <div className={styles.item}>
      <div className={styles.name}>{product.title}</div>
      <div className={styles.weight}>{product.weight} g</div>
      <div className={styles.calories}>
        {product.calories} <span className={styles.unit}>kcal</span>
      </div>
      
      <div className={styles.actions}>
        {/* DÜZENLEME BUTONU */}
        <button type="button" className={styles.actionBtn} onClick={() => onEdit(product)}>
            <img src={editIcon} alt="Edit" width="14" />
        </button>

        {/* SİLME BUTONU */}
        <button type="button" className={styles.actionBtn} onClick={() => onDelete(product._id)}>
            <img src={closeIcon} alt="Delete" width="12" />
        </button>
      </div>
    </div>
  );
};

export default DiaryProductListItem;