document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const productsContainer = document.getElementById('products-container');
    const categoryCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    const sortSelect = document.getElementById('sort-products');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    // Sepete ürün ekleme fonksiyonu
    function addToCart(id, name, price, image, quantity) {
        // app.js'de tanımlı addToCart fonksiyonunu kullan
        if (window.addToCart) {
            window.addToCart(id, name, price, image, quantity);
        } else {
            // addToCart fonksiyonu bulunamadıysa, kendi implementation'ımızı oluştur
            console.log(`Sepete eklendi: ${name}, ${quantity} adet`);
            
            // Sepet veri yapısı
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Ürün zaten sepette mi kontrol et
            const existingProduct = cart.find(item => item.id === id);
            
            if (existingProduct) {
                // Ürün zaten sepetteyse adedini artır
                existingProduct.quantity += quantity;
            } else {
                // Yeni ürün ekle
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity
                });
            }
            
            // Sepeti localStorage'a kaydet
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Sepet sayısını güncelle
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCountElement.textContent = totalItems;
            }
            
            // Bildirim göster
            alert(`${name} sepete eklendi.`);
        }
    }
    
    // URL parametrelerini al
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // URL'deki kategori parametresi varsa, ilgili checkbox'ı seç
    if (categoryParam) {
        document.getElementById('category-all').checked = false;
        const categoryCheckbox = document.getElementById(`category-${categoryParam}`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    // Kategori "Tümü" seçildiğinde diğer kategorileri tıklanamaz yap
    document.getElementById('category-all').addEventListener('change', (e) => {
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.id !== 'category-all') {
                checkbox.disabled = e.target.checked;
                if (e.target.checked) {
                    checkbox.checked = false;
                }
            }
        });
    });
    
    // Diğer kategorilerden biri seçildiğinde "Tümü" seçeneğini kaldır
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.id !== 'category-all') {
            checkbox.addEventListener('change', () => {
                const anyChecked = Array.from(categoryCheckboxes)
                    .filter(cb => cb.id !== 'category-all')
                    .some(cb => cb.checked);
                
                document.getElementById('category-all').checked = !anyChecked;
            });
        }
    });
    
    // Fiyat slider'ı değer değişimi
    priceSlider.addEventListener('input', () => {
        priceValue.textContent = `${priceSlider.value} TL`;
    });
    
    // Filtre uygula
    applyFiltersBtn.addEventListener('click', renderProducts);
    
    // Tüm ürünleri göster (sayfa ilk yüklendiğinde)
    renderProducts();
    
    // Ürünleri filtreleme ve gösterme
    function renderProducts() {
        // Loading spinner göster
        productsContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        `;
        
        // Gerçek uygulamada burada API çağrısı olabilir
        // Burada veriyi productDB.js'den alıyoruz
        setTimeout(() => {
            // Filtreleri uygula
            let filteredProducts = filterProducts();
            
            // Ürünleri sırala
            filteredProducts = sortProducts(filteredProducts);
            
            // Eğer filtrelenmiş ürün yoksa
            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = `
                    <div class="no-results">
                        <p>Bu kriterlere uygun ürün bulunamadı.</p>
                        <p>Lütfen filtrelerinizi değiştirip tekrar deneyin.</p>
                    </div>
                `;
                return;
            }
            
            // Ürünleri DOM'a ekle
            productsContainer.innerHTML = '';
            
            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                // Resim yolunu düzenleme
                const imagePath = product.image.startsWith('../') 
                    ? product.image 
                    : `../images/${product.image.replace('images/', '')}`;
                
                productCard.innerHTML = `
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${imagePath}" alt="${product.name}">
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p class="price">${product.price.toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: 'TRY'
                            })}</p>
                            <button class="btn-small add-to-cart" data-id="${product.id}">Sepete Ekle</button>
                        </div>
                    </a>
                `;
                
                productsContainer.appendChild(productCard);
            });
            
            // Sepete ekle butonlarına event listener ekle
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault(); // Link tıklamasını engelle
                    
                    const productId = parseInt(e.target.dataset.id);
                    const product = window.productDB.getProductById(productId);
                    
                    if (product) {
                        addToCart(
                            product.id,
                            product.name,
                            product.price,
                            imagePath.replace('../', ''),
                            1
                        );
                    }
                });
            });
        }, 500); // Simüle edilmiş yükleme gecikmesi
    }
    
    // Ürünleri filtrele
    function filterProducts() {
        // Seçili kategorileri al
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked && checkbox.id !== 'category-all')
            .map(checkbox => checkbox.value);
        
        // "Tümü" seçili mi kontrol et
        const isAllSelected = document.getElementById('category-all').checked;
        
        // Maksimum fiyat filtresini al
        const maxPrice = parseInt(priceSlider.value);
        
        // Tüm ürünleri productDB üzerinden al
        const allProducts = window.productDB.getAllProducts();
        
        // Filtreleme
        return allProducts.filter(product => {
            // Kategori filtreleme
            const categoryMatch = isAllSelected || selectedCategories.includes(product.category);
            
            // Fiyat filtreleme
            const priceMatch = product.price <= maxPrice;
            
            return categoryMatch && priceMatch;
        });
    }
    
    // Ürünleri sırala
    function sortProducts(productsToSort) {
        const sortValue = sortSelect.value;
        
        switch (sortValue) {
            case 'price-low':
                return [...productsToSort].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...productsToSort].sort((a, b) => b.price - a.price);
            case 'name-asc':
                return [...productsToSort].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...productsToSort].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return productsToSort;
        }
    }
}); 