import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { instance } from '../../services/api';
import styles from './DiaryAddProductForm.module.css';
import returnIcon from '../../assets/icons/return-left.svg';

const DiaryAddProductForm = ({ onSave, onClose, initialData = null }) => {
  // 1. STATE BAŞLANGIÇ DEĞERLERİNİ BURADA AYARLIYORUZ (useEffect yerine)
  const [productName, setProductName] = useState(initialData?.title || '');
  const [grams, setGrams] = useState(initialData?.weight || '');
  const [selectedProductId, setSelectedProductId] = useState(
    initialData ? (initialData.product?._id || initialData.product) : null
  );
  
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);

  const token = useSelector((state) => state.auth.token);

  // --- API İSTEĞİ (ARAMA) ---
  useEffect(() => {
    // Token yoksa, yazı kısaysa veya düzenleme modunda isim değişmediyse arama yapma
    if (!token || productName.length < 2) {
      return; 
    }
    
    if (initialData && productName === initialData.title) {
        return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await instance.get(`/products?search=${productName}`, config);
        
        const products = data.data?.result || []; 

        if (products.length > 0) {
            setSuggestions(products);
            setShowList(true);
        } else {
            setSuggestions([]);
            setShowList(false);
        }

      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [productName, token, initialData]);

  // --- HANDLERS ---
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setProductName(value);
    
    // Eğer isim değişirse ve eski isimle aynı değilse ID'yi sıfırla
    if (!initialData || value !== initialData.title) {
        setSelectedProductId(null);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowList(false);
    }
  };

  const handleSelectProduct = (product) => {
    setProductName(product.title.en);
    setSelectedProductId(product._id);
    setShowList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      alert("Please select a product from the list.");
      return;
    }
    if (!grams) {
      alert("Please enter grams.");
      return;
    }

    onSave({
      productId: selectedProductId,
      weight: Number(grams),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <button type="button" className={styles.backBtn} onClick={onClose}>
          <img src={returnIcon} alt="Back" />
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Enter product name</label>
          <input
            type="text"
            className={styles.input}
            value={productName}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Search food..."
          />
          
          {showList && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((product) => (
                <li 
                  key={product._id} 
                  className={styles.suggestionItem}
                  onMouseDown={() => handleSelectProduct(product)}
                >
                  {product.title.en} ({product.calories} kcal)
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Grams</label>
          <input
            type="number"
            className={styles.input}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.addBtn}>
            {initialData ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default DiaryAddProductForm;