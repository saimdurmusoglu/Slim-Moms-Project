import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DiaryDateCalendar from '../../components/DiaryDateCalendar/DiaryDateCalendar';
import DiaryProductListItem from '../../components/DiaryProductListItem/DiaryProductListItem';
import RightSideBar from '../../components/RightSideBar/RightSideBar';
import Container from '../../components/Container/Container';
import Modal from '../../components/Modal/Modal';
import DiaryAddProductForm from '../../components/DiaryAddProductForm/DiaryAddProductForm';
import styles from './DiaryPage.module.css';
import plusIcon from '../../assets/icons/plus.svg';
import { instance } from '../../services/api';

const DiaryPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [products, setProducts] = useState([]);
  const [diaryId, setDiaryId] = useState(null); // Silme işlemi için Günlük ID'si
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Düzenlenen ürün

  const token = useSelector((state) => state.auth.token);

  // --- 1. VERİLERİ ÇEKME ---
  const fetchDiary = async () => {
    if (!token) return;

    try {
      const offset = selectedDate.getTimezoneOffset();
      const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formattedDate = date.toISOString().split('T')[0];

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await instance.post('/diary/day', { date: formattedDate }, config);
      
      if (data.data && data.data.products) {
        setProducts(data.data.products);
        setDiaryId(data.data._id); // ID'yi kaydet
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

  // --- MODAL AÇMA (EKLEME) ---
  const openAddModal = () => {
    setEditingItem(null); // Temizle
    setIsAddModalOpen(true);
  };

  // --- MODAL AÇMA (DÜZENLEME) ---
  const openEditModal = (product) => {
    setEditingItem(product); // Düzenlenecek veriyi yükle
    setIsAddModalOpen(true);
  };

  // --- 2. KAYDETME İŞLEMİ (HEM EKLEME HEM GÜNCELLEME) ---
  const handleSaveProduct = async (productData) => {
    if (!token) return;

    try {
      const offset = selectedDate.getTimezoneOffset();
      const date = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const formattedDate = date.toISOString().split('T')[0];
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingItem) {
        // --- UPDATE (GÜNCELLEME) ---
        // Backend Rotası: PATCH /api/diary/update/:recordId
        await instance.patch(`/diary/update/${editingItem._id}`, {
            weight: productData.weight,
            date: formattedDate
        }, config);

      } else {
        // --- ADD (EKLEME) ---
        const body = {
          date: formattedDate,
          productId: productData.productId,
          weight: productData.weight
        };
        await instance.post('/diary/add', body, config);
      }
      
      // Başarılıysa:
      setIsAddModalOpen(false);
      setEditingItem(null);
      fetchDiary(); // Listeyi yenile
      
    } catch (error) {
      console.error("İşlem hatası:", error);
    }
  };

  // --- 3. SİLME İŞLEMİ ---
  const handleDelete = async (productId) => {
    if (!diaryId || !token) return;

    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Backend Rotası: DELETE /api/diary/:diaryId/:productId
        await instance.delete(`/diary/${diaryId}/${productId}`, config);

        fetchDiary(); // Listeyi yenile

    } catch (error) {
        console.error("Silme hatası", error);
    }
  };

  // Toplam kaloriyi hesapla (RightSideBar için)
  const totalCalories = products.reduce((total, item) => total + item.calories, 0);

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <DiaryDateCalendar 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
        />

        <div className={styles.productList}>
          {products.length > 0 ? (
            products.map(product => (
              <DiaryProductListItem 
                key={product._id} 
                product={product} 
                onDelete={handleDelete}
                onEdit={openEditModal} // Edit fonksiyonunu gönder
              />
            ))
          ) : (
            <p style={{textAlign: 'center', color: '#9B9FAA', marginTop: 20}}>
                List is empty. Add some food!
            </p>
          )}
        </div>

        {/* Ekleme Butonu */}
        <button className={styles.addBtn} onClick={openAddModal}>
          <img src={plusIcon} alt="Add product" />
        </button>

        {isAddModalOpen && (
          <Modal onClose={() => setIsAddModalOpen(false)}>
            <DiaryAddProductForm 
              onSave={handleSaveProduct} 
              onClose={() => setIsAddModalOpen(false)}
              initialData={editingItem} // Dolu veriyi gönder (varsa)
            />
          </Modal>
        )}

      </Container>

      {/* Tüketilen kaloriyi gönder */}
      <RightSideBar consumed={totalCalories} />
    </div>
  );
};

export default DiaryPage;