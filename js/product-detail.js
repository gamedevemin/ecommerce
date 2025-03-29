document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const productContainer = document.getElementById('product-container');
    const productBreadcrumbName = document.getElementById('product-breadcrumb-name');
    const descriptionTab = document.getElementById('description');
    const reviewsContainer = document.querySelector('.reviews-container');
    const relatedProductsContainer = document.getElementById('related-products');
    const reviewForm = document.getElementById('review-form');
    const ratingSelect = document.querySelector('.rating-select');
    const ratingInput = document.getElementById('review-rating');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // URL'den ürün ID'sini al
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Eğer ürün ID'si yoksa koleksiyon sayfasına yönlendir
    if (!productId) {
        window.location.href = 'collection.html';
        return;
    }
    
    // Ürün verilerini yükle
    loadProductDetails();
    
    // Ürün detaylarını yükle
    function loadProductDetails() {
        // Ürünü bul
        const product = products.find(p => p.id === productId);
        
        // Ürün bulunamadıysa koleksiyon sayfasına yönlendir
        if (!product) {
            window.location.href = 'collection.html';
            return;
        }
        
        // Sayfa başlığını güncelle
        document.title = `${product.name} - Lüks Çanta Butik`;
        
        // Breadcrumb ürün adını güncelle
        if (productBreadcrumbName) {
            productBreadcrumbName.textContent = product.name;
        }
        
        // Ürün detaylarını göster
        showProductDetails(product);
        
        // Açıklama sekmesini güncelle
        if (descriptionTab) {
            descriptionTab.innerHTML = `
                <h3>Ürün Açıklaması</h3>
                <p>${product.description}</p>
            `;
        }
        
        // Yorumları göster
        showReviews(product.reviews);
        
        // Benzer ürünleri göster
        showRelatedProducts(product);
    }
    
    // Ürün detaylarını gösterme
    function showProductDetails(product) {
        // Stok durumunu kontrol et
        let stockStatus, stockClass;
        if (product.stock <= 0) {
            stockStatus = 'Stokta Yok';
            stockClass = 'out-of-stock';
        } else if (product.stock < 5) {
            stockStatus = `Son ${product.stock} ürün!`;
            stockClass = 'low-stock';
        } else {
            stockStatus = 'Stokta Var';
            stockClass = 'in-stock';
        }
        
        // Kategori adını formatla
        let categoryName;
        switch (product.category) {
            case 'clutch':
                categoryName = 'El Çantası';
                break;
            case 'shoulder':
                categoryName = 'Omuz Çantası';
                break;
            case 'tote':
                categoryName = 'Büyük Çanta';
                break;
            default:
                categoryName = 'Diğer';
        }
        
        // Ürün galerisini oluştur
        const galleryImages = product.gallery.map((img, index) => {
            const activeClass = index === 0 ? 'active' : '';
            return `<img src="${img}" alt="${product.name}" class="thumbnail ${activeClass}" data-index="${index}">`;
        }).join('');
        
        // Ürün detay HTML'ini oluştur
        productContainer.innerHTML = `
            <div class="product-detail">
                <div class="product-gallery">
                    <img src="${product.gallery[0]}" alt="${product.name}" class="main-image" id="main-product-image">
                    <div class="thumbnail-container">
                        ${galleryImages}
                    </div>
                </div>
                <div class="product-info">
                    <h1 class="product-name">${product.name}</h1>
                    <div class="product-price">${product.price.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                    })}</div>
                    <div class="product-category">${categoryName}</div>
                    <div class="product-stock ${stockClass}">${stockStatus}</div>
                    
                    <div class="quantity-selector">
                        <label for="quantity">Adet:</label>
                        <div class="quantity-input-group">
                            <button class="quantity-btn" id="decrease-quantity">-</button>
                            <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="${product.stock}" ${product.stock <= 0 ? 'disabled' : ''}>
                            <button class="quantity-btn" id="increase-quantity">+</button>
                        </div>
                    </div>
                    
                    <button class="btn add-to-cart-btn" id="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                        ${product.stock <= 0 ? 'Stokta Yok' : 'Sepete Ekle'}
                    </button>
                </div>
            </div>
        `;
        
        // Küçük resim galerisi fonksiyonları
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-product-image');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Aktif sınıfını tüm thumb'lardan kaldır
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Tıklanan thumb'a aktif sınıfı ekle
                thumb.classList.add('active');
                
                // Ana görüntüyü güncelle
                mainImage.src = thumb.src;
            });
        });
        
        // Miktar butonlarına olay dinleyicileri ekle
        const quantityInput = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decrease-quantity');
        const increaseBtn = document.getElementById('increase-quantity');
        
        decreaseBtn.addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            if (parseInt(quantityInput.value) < product.stock) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            }
        });
        
        // Sepete ekle butonu
        const addToCartBtn = document.getElementById('add-to-cart');
        
        addToCartBtn.addEventListener('click', () => {
            if (product.stock > 0) {
                const quantity = parseInt(quantityInput.value);
                
                addToCart(
                    product.id,
                    product.name,
                    product.price,
                    product.image.replace('../', ''),
                    quantity
                );
                
                // Butonu geçici olarak devre dışı bırak
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Sepete Eklendi!';
                
                setTimeout(() => {
                    addToCartBtn.disabled = false;
                    addToCartBtn.textContent = 'Sepete Ekle';
                }, 2000);
            }
        });
    }
    
    // Yorumları gösterme
    function showReviews(reviews) {
        if (!reviewsContainer) return;
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = `
                <div class="no-reviews">
                    <p>Bu ürün için henüz yorum yapılmamış.</p>
                    <p>İlk yorumu siz yapın!</p>
                </div>
            `;
            return;
        }
        
        reviewsContainer.innerHTML = '';
        
        reviews.forEach(review => {
            const stars = Array(5).fill('').map((_, i) => {
                return i < review.rating ? 
                    '<i class="fas fa-star"></i>' : 
                    '<i class="far fa-star"></i>';
            }).join('');
            
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-user">${review.user}</div>
                    <div class="review-rating">${stars}</div>
                </div>
                <div class="review-comment">${review.comment}</div>
            `;
            
            reviewsContainer.appendChild(reviewItem);
        });
    }
    
    // Benzer ürünleri gösterme (aynı kategoriden)
    function showRelatedProducts(currentProduct) {
        if (!relatedProductsContainer) return;
        
        // Aynı kategoriden ürünleri filtrele (mevcut ürün hariç)
        const relatedProducts = products.filter(product => 
            product.category === currentProduct.category && 
            product.id !== currentProduct.id
        );
        
        // En fazla 4 ürün göster
        const productsToShow = relatedProducts.slice(0, 4);
        
        // Hiç benzer ürün yoksa bölümü gizle
        if (productsToShow.length === 0) {
            document.querySelector('.related-products').style.display = 'none';
            return;
        }
        
        relatedProductsContainer.innerHTML = '';
        
        // Ürünleri göster
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
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
            
            relatedProductsContainer.appendChild(productCard);
        });
        
        // Sepete ekle butonlarına event listener ekle
        document.querySelectorAll('#related-products .add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Link tıklamasını engelle
                
                const productId = parseInt(e.target.dataset.id);
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    addToCart(
                        product.id,
                        product.name,
                        product.price,
                        product.image.replace('../', ''),
                        1
                    );
                }
            });
        });
    }
    
    // Sekme fonksiyonları
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Tüm butonlardan aktif sınıfını kaldır
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tüm panellerden aktif sınıfını kaldır
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Tıklanan butona aktif sınıfı ekle
            button.classList.add('active');
            
            // İlgili paneli göster
            const tabName = button.dataset.tab;
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Yıldız derecelendirme işlevi
    const stars = document.querySelectorAll('.rating-select i');
    
    // Yıldızlara aktif sınıfı ekle (başlangıçta 5 yıldız)
    stars.forEach(star => {
        star.classList.add('active');
        
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            
            // Tüm yıldızlardan aktif sınıfını kaldır
            stars.forEach(s => s.classList.remove('active'));
            
            // Seçilen yıldıza kadar olan tüm yıldızlara aktif sınıfı ekle
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.classList.add('active');
                }
            });
            
            // Gizli input değerini güncelle
            ratingInput.value = rating;
        });
    });
    
    // Yorum formu gönderme
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('review-name');
            const commentInput = document.getElementById('review-comment');
            
            const name = nameInput.value.trim();
            const rating = parseInt(ratingInput.value);
            const comment = commentInput.value.trim();
            
            if (!name || !comment) {
                showNotification('Lütfen tüm alanları doldurun!', 'error');
                return;
            }
            
            // Yeni yorum oluştur
            const newReview = {
                user: name,
                rating: rating,
                comment: comment
            };
            
            // Ürünü bul ve yorumu ekle (gerçek bir uygulamada API çağrısı olurdu)
            const product = products.find(p => p.id === productId);
            
            if (product) {
                product.reviews.push(newReview);
                
                // Yorumları güncelle
                showReviews(product.reviews);
                
                // Formu sıfırla
                reviewForm.reset();
                
                // Yıldızları sıfırla (5 yıldız)
                stars.forEach(star => star.classList.add('active'));
                ratingInput.value = 5;
                
                // Başarı mesajı göster
                showNotification('Yorumunuz başarıyla eklendi!', 'success');
            }
        });
    }
}); 