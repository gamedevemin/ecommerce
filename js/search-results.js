document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const productsContainer = document.getElementById('products-container');
    const searchQueryDisplay = document.getElementById('search-query-display');
    
    // URL'den arama sorgusunu al
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    // Arama sorgusunu göster
    if (searchQueryDisplay) {
        searchQueryDisplay.textContent = `"${searchQuery}" için arama sonuçları`;
    }
    
    // Arama sonuçlarını göster
    if (searchQuery) {
        displaySearchResults(searchQuery);
    } else {
        // Arama sorgusu yoksa hata mesajı göster
        productsContainer.innerHTML = `
            <div class="no-results">
                <p>Lütfen bir arama sorgusu girin.</p>
                <a href="../index.html" class="btn">Ana Sayfaya Dön</a>
            </div>
        `;
    }
    
    // Arama sonuçlarını gösterme fonksiyonu
    function displaySearchResults(query) {
        // Yükleniyor göster
        productsContainer.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        `;
        
        // Gerçek uygulamada burada API çağrısı olabilir
        setTimeout(() => {
            // Ürünleri ara (app.js'deki searchProducts fonksiyonu veya productDB.searchProducts)
            let searchResults = [];
            
            if (window.productDB) {
                searchResults = window.productDB.searchProducts(query);
            } else if (window.searchProducts) {
                searchResults = window.searchProducts(query);
            } else {
                // Arama işlevi bulunamadıysa, localStorage'dan al
                const products = JSON.parse(localStorage.getItem('products')) || [];
                searchResults = products.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );
            }
            
            // Eğer arama sonucu yoksa
            if (searchResults.length === 0) {
                productsContainer.innerHTML = `
                    <div class="no-results">
                        <p>"${query}" için sonuç bulunamadı.</p>
                        <p>Lütfen başka bir arama terimi deneyin veya koleksiyona göz atın.</p>
                        <a href="collection.html" class="btn">Koleksiyona Göz At</a>
                    </div>
                `;
                return;
            }
            
            // Ürünleri DOM'a ekle
            productsContainer.innerHTML = '';
            
            searchResults.forEach(product => {
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
                    const product = window.productDB 
                        ? window.productDB.getProductById(productId)
                        : searchResults.find(p => p.id === productId);
                    
                    if (product) {
                        // Sepete ekle (global addToCart fonksiyonu)
                        if (window.addToCart) {
                            window.addToCart(
                                product.id,
                                product.name,
                                product.price,
                                imagePath.replace('../', ''),
                                1
                            );
                        } else {
                            alert(`${product.name} sepete eklendi.`);
                        }
                    }
                });
            });
        }, 500); // Simüle edilmiş yükleme gecikmesi
    }
}); 