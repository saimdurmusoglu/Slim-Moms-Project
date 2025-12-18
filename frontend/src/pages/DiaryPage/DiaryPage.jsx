import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DiaryDateCalendar from "../../components/DiaryDateCalendar/DiaryDateCalendar";
import DiaryProductListItem from "../../components/DiaryProductListItem/DiaryProductListItem";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import Modal from "../../components/Modal/Modal";
import DiaryAddProductForm from "../../components/DiaryAddProductForm/DiaryAddProductForm";
import styles from "./DiaryPage.module.css";
import PlusIcon from "../../assets/icons/plus.svg?react";
import { instance } from "../../services/api";

const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [diaryId, setDiaryId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const fetchDiary = async () => {
    if (!token) return;
    try {
      const offset = selectedDate.getTimezoneOffset();
      const date = new Date(selectedDate.getTime() - offset * 60 * 1000);
      const formattedDate = date.toISOString().split("T")[0];
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await instance.post(
        "/diary/day",
        { date: formattedDate },
        config
      );

      if (data.data && data.data.products) {
        setProducts(data.data.products);
        setDiaryId(data.data._id);
      } else {
        setProducts([]);
        setDiaryId(null);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error.message);
    }
  };

  useEffect(() => {
    fetchDiary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, token]);

  const openAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingItem(product);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (!token) return;
    try {
      const offset = selectedDate.getTimezoneOffset();
      const date = new Date(selectedDate.getTime() - offset * 60 * 1000);
      const formattedDate = date.toISOString().split("T")[0];
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingItem) {
        await instance.patch(
          `/diary/update/${editingItem._id}`,
          {
            weight: productData.weight,
            date: formattedDate,
          },
          config
        );
      } else {
        const body = {
          date: formattedDate,
          productId: productData.productId,
          weight: productData.weight,
        };
        await instance.post("/diary/add", body, config);
      }

      setIsAddModalOpen(false);
      setEditingItem(null);
      fetchDiary();
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!diaryId || !token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await instance.delete(`/diary/${diaryId}/${productId}`, config);
      fetchDiary();
    } catch (error) {
      console.error("Silme hatası", error);
    }
  };

  const totalCalories = products.reduce(
    (total, item) => total + item.calories,
    0
  );

  return (
    <section className={styles.diarySection}>
      <div
        className={`${styles.diaryContent} ${
          !isLoggedIn ? styles.withBackground : ""
        }`}
      >
        <div className={styles.leftSide}>
          <DiaryDateCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <div className={styles.desktopFormWrapper}>
            <DiaryAddProductForm onSave={handleSaveProduct} isMobile={false} />
          </div>

          <div className={styles.productList}>
            {products.length > 0 ? (
              products.map((product) => (
                <DiaryProductListItem
                  key={product._id}
                  product={product}
                  onDelete={handleDelete}
                  onEdit={openEditModal}
                />
              ))
            ) : (
              <p className={styles.emptyText}>List is empty. Add some food!</p>
            )}
          </div>

          <button
            className={styles.mobileAddBtn}
            onClick={openAddModal}
            aria-label="Add new food item"
            title="Add food"
          >
            <PlusIcon />
          </button>
        </div>

        <div className={styles.rightSide}>
          <RightSideBar consumed={totalCalories} isDiary={true} />
        </div>
      </div>

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <DiaryAddProductForm
            onSave={handleSaveProduct}
            onClose={() => setIsAddModalOpen(false)}
            initialData={editingItem}
            isMobile={true}
          />
        </Modal>
      )}
    </section>
  );
};

export default DiaryPage;