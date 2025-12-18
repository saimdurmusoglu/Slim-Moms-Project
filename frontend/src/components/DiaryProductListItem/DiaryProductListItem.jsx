import styles from "./DiaryProductListItem.module.css";
import CloseIcon from "../../assets/icons/close.svg?react";
import EditIcon from "../../assets/icons/edit.svg?react";

const DiaryProductListItem = ({product, onDelete, onEdit}) => {
  return (
    <div className={styles.item}>
      <div className={styles.name}>{product.title}</div>
      <div className={styles.weight}>{product.weight} g</div>
      <div className={styles.calories}>
        {product.calories} <span className={styles.unit}>kcal</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.title}`}
          title="Edit product"
        >
          <EditIcon width="12" height="12" />
        </button>

        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onDelete(product._id)}
          aria-label={`Delete ${product.title}`}
          title="Delete product"
        >
          <CloseIcon width="12" height="12" />
        </button>
      </div>
    </div>
  );
};

export default DiaryProductListItem;
