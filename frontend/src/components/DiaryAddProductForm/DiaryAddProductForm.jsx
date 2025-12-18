import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { instance } from "../../services/api";
import styles from "./DiaryAddProductForm.module.css";
import ReturnIcon from "../../assets/icons/return-left.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";

const DiaryAddProductForm = ({
  onSave,
  onClose,
  initialData = null,
  isMobile = false,
  isModal = false,
}) => {
  const [productName, setProductName] = useState(initialData?.title || "");
  const [grams, setGrams] = useState(initialData?.weight || "");
  const [selectedProductId, setSelectedProductId] = useState(
    initialData ? initialData.product?._id || initialData.product : null
  );

  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // 1. Şartlı kontrolleri yapıyoruz ama setState'leri asenkron bloğa bırakıyoruz
    if (!token || productName.length < 2 || selectedProductId) {
      // Önceki sonuçları temizlemek gerekirse bunu render dışında yapmak performansı korur
      return; 
    }

    if (initialData && productName === initialData.title) return;

    const timeoutId = setTimeout(async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await instance.get(
          `/products?search=${productName}`,
          config
        );
        const products = data.data?.result || [];
        
        // State güncellemeleri asenkron blok içinde güvenlidir
        setSuggestions(products);
        setShowList(products.length > 0);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [productName, token, initialData, selectedProductId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setProductName(value);

    // İsim değiştiğinde listeyi ve seçimi burada manuel sıfırlamak en temizidir
    if (value.length < 2) {
      setSuggestions([]);
      setShowList(false);
    }

    if (!initialData || value !== initialData.title) {
      setSelectedProductId(null);
    }
  };

  const handleSelectProduct = (product) => {
    setProductName(product.title.en);
    setSelectedProductId(product._id);
    setSuggestions([]); // Seçim yapıldığında listeyi temizle
    setShowList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return alert("Please select a product from the list.");
    if (!grams) return alert("Please enter grams.");
    
    onSave({
      productId: selectedProductId,
      weight: Number(grams),
    });
    
    setProductName("");
    setGrams("");
    setSelectedProductId(null);
  };

  return (
    <div className={`${styles.container} ${!isMobile ? styles.desktopContainer : ""} ${isModal ? styles.modalVersion : ""}`}>
      {isMobile && isModal && (
        <div className={styles.headerBar}>
          <button type="button" className={styles.backBtn} onClick={onClose} aria-label="Go back">
            <ReturnIcon width="18" height="12" />
          </button>
        </div>
      )}

      <form className={`${styles.form} ${!isMobile ? styles.desktopForm : ""}`} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            id="productSearch"
            type="text"
            className={styles.input}
            value={productName}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder={isModal ? "Enter product name again" : "Enter product name"}
          />

          {showList && suggestions.length > 0 && (
            <ul className={styles.suggestionsList} role="listbox">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  className={styles.suggestionItem}
                  onMouseDown={() => handleSelectProduct(product)}
                  role="option"
                >
                  {product.title.en} ({product.calories} kcal)
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.inputGroup} ${styles.gramsGroup}`}>
          <input
            id="gramsInput"
            type="number"
            className={styles.input}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder={isModal ? "Enter grams again" : "Grams"}
          />
        </div>

        <button type="submit" className={`${styles.addBtn} ${!isMobile ? styles.desktopAddBtn : ""}`}>
          {isMobile ? (isModal ? "Update" : "Add") : <PlusIcon width="14" height="14" />}
        </button>
      </form>
    </div>
  );
};

export default DiaryAddProductForm;