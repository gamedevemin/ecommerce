document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElem = document.getElementById('subtotal');
    const shippingElem = document.getElementById('shipping');
    const totalElem = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const orderSummaryElem = document.getElementById('order-summary');
    const addressForm = document.getElementById('address-form');
    const applyPromoBtn = document.getElementById('apply-promo');
    const promoInput = document.getElementById('promo-input');
    
    // Kargo ücreti (sabit)
    const SHIPPING_COST = 29.99;
    
    // Promosyon kodları
    const promoCodes = {
        'WELCOME10': 10, // %10 indirim
        'SUMMER25': 25,  // %25 indirim
        'FREESHIP': 'free-shipping' // Ücretsiz kargo
    };
    
    // Uygulanan promosyon
    let appliedPromo = null;
    
    // Sepeti yükle ve göster
    loadCart();
    
    // Promosyon kodu uygula
    applyPromoBtn.addEventListener('click', () => {
        const promoCode = promoInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            showNotification('Lütfen bir promosyon kodu girin.');
            return;
        }
        
        if (promoCodes[promoCode]) {
            appliedPromo = {
                code: promoCode,
                discount: promoCodes[promoCode]
            };
            
            showNotification(`Promosyon kodu "${promoCode}" başarıyla uygulandı!`);
            updateCartSummary();
        } else {
            showNotification('Geçersiz promosyon kodu.');
        }
    });
    
    // Sepeti Yükleme
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Yükleniyor göstergesini kaldır
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            // Sepet boşsa
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Sepetiniz boş</p>
                    <a href="collection.html" class="btn">Alışverişe Başla</a>
                </div>
            `;
            
            // Sipariş özeti bölümünü güncelle
            updateCartSummary();
            
            // Ödeme butonunu devre dışı bırak
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
            
            return;
        }
        
        // Sepetteki her ürün için HTML oluştur
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            
            if (product) {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">${item.price.toLocaleString('tr-TR', {
                            style: 'currency',
                            currency: 'TRY'
                        })}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash-alt"></i> Kaldır
                            </button>
                        </div>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            }
        });
        
        // Event Listener'ları ekle
        addCartEventListeners();
        
        // Sipariş özeti bölümünü güncelle
        updateCartSummary();
    }
    
    // Cart Event Listener'ları
    function addCartEventListeners() {
        // Miktar azaltma butonları
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                updateItemQuantity(id, 'decrease');
            });
        });
        
        // Miktar artırma butonları
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                updateItemQuantity(id, 'increase');
            });
        });
        
        // Miktar inputları
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(input.dataset.id);
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0) {
                    updateItemQuantity(id, 'set', newQuantity);
                }
            });
        });
        
        // Kaldır butonları
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                removeItemFromCart(id);
            });
        });
    }
    
    // Ürün Miktarı Güncelleme
    function updateItemQuantity(id, action, value = null) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        if (action === 'decrease') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            }
        } else if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'set' && value !== null) {
            cart[itemIndex].quantity = value;
        }
        
        // Sepeti güncelle
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Sayfayı yeniden yükle
        loadCart();
        
        // Sepet sayacını güncelle
        updateCartCount();
    }
    
    // Sepetten Ürün Kaldırma
    function removeItemFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Ürünü sepetten çıkar
        cart = cart.filter(item => item.id !== id);
        
        // Sepeti güncelle
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Sayfayı yeniden yükle
        loadCart();
        
        // Sepet sayacını güncelle
        updateCartCount();
        
        // Bildirim göster
        showNotification('Ürün sepetten kaldırıldı.');
    }
    
    // Sipariş Özeti Güncelleme
    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Alt toplam hesapla
        let subtotal = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Promosyon kodu indirimi uygula
        let discount = 0;
        let shipping = SHIPPING_COST;
        
        if (appliedPromo) {
            if (appliedPromo.discount === 'free-shipping') {
                shipping = 0;
            } else {
                discount = (subtotal * appliedPromo.discount) / 100;
                subtotal -= discount;
            }
        }
        
        // Toplam hesapla
        const total = subtotal + shipping;
        
        // DOM'a güncelle
        subtotalElem.textContent = subtotal.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
        
        shippingElem.textContent = shipping.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
        
        totalElem.textContent = total.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    }
    
    // Ödeme Modal İşlemleri
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Sepetiniz boş!');
                return;
            }
            
            // Sipariş özetini hazırla
            let orderSummaryHTML = '<div class="order-items">';
            
            cart.forEach(item => {
                orderSummaryHTML += `
                    <div class="order-item">
                        <div class="order-item-name">
                            ${item.name} x ${item.quantity}
                        </div>
                        <div class="order-item-price">
                            ${(item.price * item.quantity).toLocaleString('tr-TR', {
                                style: 'currency',
                                currency: 'TRY'
                            })}
                        </div>
                    </div>
                `;
            });
            
            orderSummaryHTML += '</div>';
            orderSummaryHTML += `
                <div class="order-total">
                    <div class="total-row">
                        <span>Toplam:</span>
                        <span>${totalElem.textContent}</span>
                    </div>
                </div>
            `;
            
            orderSummaryElem.innerHTML = orderSummaryHTML;
            
            // Modalı göster
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Sayfanın scroll'unu devre dışı bırak
        });
    }
    
    // Modalı kapatma
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Sayfanın scroll'unu geri aç
        });
    }
    
    // Modal dışına tıklayarak kapatma
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Sipariş tamamlama formu
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form verilerini al (gerçek bir uygulamada sunucuya gönderilir)
            // Burada sadece simüle ediyoruz
            
            // Sepeti temizle
            localStorage.setItem('cart', JSON.stringify([]));
            
            // Modalı kapat
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Teşekkür sayfasına yönlendir
            window.location.href = 'order-confirmation.html';
        });
    }
    
    // Ödeme yöntemi değiştiğinde
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardDetails = document.querySelector('.credit-card-details');
    
    if (paymentMethods && creditCardDetails) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                if (e.target.id === 'credit-card') {
                    creditCardDetails.style.display = 'block';
                } else {
                    creditCardDetails.style.display = 'none';
                }
            });
        });
    }
}); 