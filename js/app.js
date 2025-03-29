// DOM Elemanları
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const cartCountElem = document.getElementById('cart-count');
const newsletterForm = document.getElementById('newsletter-form');

document.addEventListener('DOMContentLoaded', () => {
    // Mobil menü toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Arama toggle
    if (searchIcon && searchBar) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchBar.classList.toggle('active');
        });
    }
    
    // Sayfa dışına tıklandığında menü ve arama kapanması
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !e.target.closest('#mobile-menu') && !e.target.closest('#menu-toggle')) {
            mobileMenu.classList.remove('active');
        }
        
        if (searchBar && searchBar.classList.contains('active') && 
            !e.target.closest('#search-bar') && !e.target.closest('#search-icon')) {
            searchBar.classList.remove('active');
        }
    });
    
    // Sepet sayısını göster
    updateCartCount();
    
    // Bülten abone olma formunu dinle
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            // Gerçek bir uygulama için, burada email'i sunucuya gönderme işlemi yapılırdı
            showNotification('Bültene başarıyla abone oldunuz!');
            newsletterForm.reset();
        });
    }
});

// Sepet sayısını güncelleme
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Sepete ürün ekleme - Global olarak erişilebilir
window.addToCart = function(id, name, price, image, quantity) {
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
    updateCartCount();
    
    // Bildirim göster
    alert(`${name} sepete eklendi.`);
};

// Sepetten ürün çıkarma
window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ID'ye göre ürünü sepetten çıkar
    cart = cart.filter(item => item.id !== id);
    
    // Güncellenmiş sepeti localStorage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Sepet sayısını güncelle
    updateCartCount();
    
    return cart;
};

// Bildirim Gösterme
function showNotification(message) {
    // Eğer zaten bir bildirim gösteriliyorsa, onu kaldır
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Bildirimi sayfaya ekle
    document.body.appendChild(notification);
    
    // CSS ekle
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Animasyon
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Arama İşlevi
function searchProducts(query) {
    // Ürünleri veritabanından al
    if (window.productDB) {
        return window.productDB.searchProducts(query);
    } else {
        // Geriye dönük uyumluluk için eski kod korundu
        // Gerçek bir uygulamada bu işlev sunucudan veri alabilir
        // Bu örnekte, yerel ürün verilerini filtreliyoruz
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        return filteredProducts;
    }
}

// Arama formunu dinle
if (searchBar) {
    const searchForm = searchBar.querySelector('button');
    const searchInput = searchBar.querySelector('input');
    
    searchForm.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            // Arama sonuçları sayfasına yönlendirme
            window.location.href = `pages/search-results.html?q=${encodeURIComponent(query)}`;
        }
    });
    
    // Enter tuşuna basılınca arama yap
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            
            if (query) {
                window.location.href = `pages/search-results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
} 