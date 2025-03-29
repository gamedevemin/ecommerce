document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const productsTable = document.getElementById('products-table');
    const productSearch = document.getElementById('product-search');
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const stockFilter = document.getElementById('stock-filter');
    const sortFilter = document.getElementById('sort-filter');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const productForm = document.getElementById('product-form');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Form Elemanları
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productCategorySelect = document.getElementById('product-category');
    const productPriceInput = document.getElementById('product-price');
    const productStockInput = document.getElementById('product-stock');
    const productDescriptionInput = document.getElementById('product-description');
    const productImageInput = document.getElementById('product-image');
    const featuredYesInput = document.getElementById('featured-yes');
    const featuredNoInput = document.getElementById('featured-no');
    
    // Ürünleri yükle
    loadProducts();
    
    // Filtrelere değişiklik dinleyicileri ekle
    [categoryFilter, stockFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', loadProducts);
    });
    
    // Arama fonksiyonu
    searchBtn.addEventListener('click', loadProducts);
    productSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadProducts();
        }
    });
    
    // Ürün ekleme butonuna tıklama
    addProductBtn.addEventListener('click', () => {
        // Formu sıfırla
        resetForm();
        
        // Modalı göster
        modalTitle.textContent = 'Yeni Ürün Ekle';
        productModal.style.display = 'block';
    });
    
    // Modalı kapatma
    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });
    
    // Modal dışına tıklayarak kapatma
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });
    
    // İptal butonu
    cancelBtn.addEventListener('click', () => {
        productModal.style.display = 'none';
    });
    
    // Ürün formunu gönderme
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form verilerini al
        const productData = {
            name: productNameInput.value.trim(),
            category: productCategorySelect.value,
            price: parseFloat(productPriceInput.value),
            stock: parseInt(productStockInput.value),
            description: productDescriptionInput.value.trim(),
            image: productImageInput.value.trim(),
            featured: featuredYesInput.checked
        };
        
        // Ürün ID'si varsa, güncelleme yapıyoruz
        if (productIdInput.value) {
            productData.id = parseInt(productIdInput.value);
            
            // Ürünü güncelle
            await updateProduct(productData);
        } else {
            // Yeni ürün ekle
            await addProduct(productData);
        }
        
        // Modalı kapat
        productModal.style.display = 'none';
        
        // Ürünleri yeniden yükle
        loadProducts();
    });
    
    // Ürünleri Yükleme Fonksiyonu
    async function loadProducts() {
        if (!productsTable) return;
        
        // Arama metni
        const searchText = productSearch.value.trim().toLowerCase();
        
        // Kategori filtresi
        const category = categoryFilter.value;
        
        // Stok filtresi
        const stockStatus = stockFilter.value;
        
        // Sıralama filtresi
        const sortBy = sortFilter.value;
        
        try {
            // Ürünleri API'den al
            let products = await window.apiRequest('products');
            
            // Filtreleme işlemleri
            if (searchText) {
                products = products.filter(product => 
                    product.name.toLowerCase().includes(searchText) || 
                    product.description.toLowerCase().includes(searchText)
                );
            }
            
            if (category) {
                products = products.filter(product => product.category === category);
            }
            
            if (stockStatus) {
                switch (stockStatus) {
                    case 'in-stock':
                        products = products.filter(product => product.stock > 10);
                        break;
                    case 'low-stock':
                        products = products.filter(product => product.stock > 0 && product.stock <= 10);
                        break;
                    case 'out-of-stock':
                        products = products.filter(product => product.stock === 0);
                        break;
                }
            }
            
            // Sıralama işlemleri
            switch (sortBy) {
                case 'name-asc':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    products.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'stock-low':
                    products.sort((a, b) => a.stock - b.stock);
                    break;
                case 'stock-high':
                    products.sort((a, b) => b.stock - a.stock);
                    break;
            }
            
            // Tabloyu temizle
            productsTable.innerHTML = '';
            
            // Ürün yoksa mesaj göster
            if (products.length === 0) {
                productsTable.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center">Arama kriterlerine uygun ürün bulunamadı.</td>
                    </tr>
                `;
                return;
            }
            
            // Ürünleri tabloya ekle
            products.forEach(product => {
                const row = document.createElement('tr');
                
                // Stok durumu
                let stockStatus, stockClass;
                if (product.stock === 0) {
                    stockStatus = 'Stokta Yok';
                    stockClass = 'error';
                } else if (product.stock <= 5) {
                    stockStatus = 'Kritik';
                    stockClass = 'error';
                } else if (product.stock <= 10) {
                    stockStatus = 'Düşük';
                    stockClass = 'warning';
                } else {
                    stockStatus = 'Stokta';
                    stockClass = 'success';
                }
                
                // Kategori adı
                let categoryName;
                switch (product.category) {
                    case 'clutch':
                        categoryName = 'El Çantaları';
                        break;
                    case 'shoulder':
                        categoryName = 'Omuz Çantaları';
                        break;
                    case 'tote':
                        categoryName = 'Büyük Çantalar';
                        break;
                    default:
                        categoryName = product.category;
                }
                
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>
                        <img src="${product.image.replace('../', '')}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${product.name}</td>
                    <td>${categoryName}</td>
                    <td>${window.formatCurrency(product.price)}</td>
                    <td>${product.stock}</td>
                    <td><span class="status-badge ${stockClass}">${stockStatus}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="edit-btn" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                productsTable.appendChild(row);
            });
            
            // Düzenleme ve silme butonlarına olay dinleyicileri ekle
            attachActionListeners();
        } catch (error) {
            console.error('Ürünler yüklenirken hata oluştu:', error);
            window.showAdminNotification('Ürünler yüklenirken bir hata oluştu.', 'error');
        }
    }
    
    // Ürün düzenleme ve silme butonlarına dinleyiciler ekle
    function attachActionListeners() {
        // Düzenleme butonları
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const productId = parseInt(button.dataset.id);
                
                // Ürün verilerini al
                const product = await getProductById(productId);
                
                if (product) {
                    // Form alanlarını doldur
                    productIdInput.value = product.id;
                    productNameInput.value = product.name;
                    productCategorySelect.value = product.category;
                    productPriceInput.value = product.price;
                    productStockInput.value = product.stock;
                    productDescriptionInput.value = product.description;
                    productImageInput.value = product.image;
                    
                    // Öne çıkan ürün seçeneğini işaretle
                    if (product.featured) {
                        featuredYesInput.checked = true;
                    } else {
                        featuredNoInput.checked = true;
                    }
                    
                    // Modalı göster
                    modalTitle.textContent = 'Ürün Düzenle';
                    productModal.style.display = 'block';
                }
            });
        });
        
        // Silme butonları
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const productId = parseInt(button.dataset.id);
                
                if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
                    await deleteProduct(productId);
                    loadProducts(); // Ürünleri yeniden yükle
                }
            });
        });
    }
    
    // Ürün detaylarını getirme
    async function getProductById(productId) {
        const products = await window.apiRequest('products');
        return products.find(product => product.id === productId);
    }
    
    // Ürün güncelleme
    async function updateProduct(productData) {
        try {
            await window.apiRequest('products', 'PUT', productData);
            window.showAdminNotification('Ürün başarıyla güncellendi.', 'success');
        } catch (error) {
            window.showAdminNotification('Ürün güncellenirken bir hata oluştu.', 'error');
        }
    }
    
    // Yeni ürün ekleme
    async function addProduct(productData) {
        try {
            // Yeni bir ID oluştur
            const products = await window.apiRequest('products');
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            
            // Yeni ürünü ekle
            productData.id = newId;
            
            // Diğer gerekli alanları ekle
            productData.gallery = [productData.image];
            productData.reviews = [];
            
            await window.apiRequest('products', 'POST', productData);
            window.showAdminNotification('Ürün başarıyla eklendi.', 'success');
        } catch (error) {
            window.showAdminNotification('Ürün eklenirken bir hata oluştu.', 'error');
        }
    }
    
    // Ürün silme
    async function deleteProduct(productId) {
        try {
            await window.apiRequest('products', 'DELETE', { id: productId });
            window.showAdminNotification('Ürün başarıyla silindi.', 'success');
        } catch (error) {
            window.showAdminNotification('Ürün silinirken bir hata oluştu.', 'error');
        }
    }
    
    // Formu sıfırlama
    function resetForm() {
        productIdInput.value = '';
        productNameInput.value = '';
        productCategorySelect.value = '';
        productPriceInput.value = '';
        productStockInput.value = '';
        productDescriptionInput.value = '';
        productImageInput.value = '';
        featuredNoInput.checked = true;
    }
}); 