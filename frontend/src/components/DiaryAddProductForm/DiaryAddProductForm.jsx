import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {instance} from "../../services/api";
import styles from "./DiaryAddProductForm.module.css";
import ReturnIcon from "../../assets/icons/return-left.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";

const DiaryAddProductForm = ({
  onSave,
  onClose,
  initialData = null,
  isMobile = false,
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
    if (!token || productName.length < 2) return;

    if (selectedProductId) return;

    if (initialData && productName === initialData.title) return;

    const timeoutId = setTimeout(async () => {
      try {
        const config = {headers: {Authorization: `Bearer ${token}`}};
        const {data} = await instance.get(
          `/products?search=${productName}`,
          config
        );
        const products = data.data?.result || [];
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

    if (!initialData || value !== initialData.title) setSelectedProductId(null);

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
    setProductName("");
    setGrams("");
    setSelectedProductId(null);
  };

  return (
    <div
      className={`${styles.container} ${
        !isMobile ? styles.desktopContainer : ""
      }`}
    >
      {isMobile && (
        <div className={styles.headerBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onClose}
            aria-label="Go back to diary"
          >
            <ReturnIcon width="18" height="12" />
          </button>
        </div>
      )}

      <form
        className={`${styles.form} ${!isMobile ? styles.desktopForm : ""}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.inputGroup}>
          {isMobile && (
            <label htmlFor="productSearch" className="visually-hidden">
              Enter product name
            </label>
          )}

          <input
            id="productSearch"
            type="text"
            className={styles.input}
            value={productName}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder={!isMobile ? "Enter product name" : ""}
            aria-label="Search for a product"
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
          {isMobile && (
            <label htmlFor="gramsInput" className="visually-hidden">
              Grams
            </label>
          )}
          <input
            id="gramsInput"
            type="number"
            className={styles.input}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder={!isMobile ? "Grams" : ""}
            aria-label="Weight in grams"
          />
        </div>

        <button
          type="submit"
          className={`${styles.addBtn} ${
            !isMobile ? styles.desktopAddBtn : ""
          }`}
          aria-label="Add product to diary"
          title="Add product"
        >
          {isMobile ? (
            initialData ? (
              "Update"
            ) : (
              "Add"
            )
          ) : (
            <PlusIcon width="14" height="14" />
          )}
        </button>
      </form>
    </div>
  );
};

export default DiaryAddProductForm;
