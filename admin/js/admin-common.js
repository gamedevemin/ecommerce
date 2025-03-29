document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const adminSidebar = document.querySelector('.admin-sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const adminName = document.getElementById('admin-name');
    const adminUserDropdown = document.querySelector('.admin-user-dropdown');
    const adminUser = document.querySelector('.admin-user');
    const logoutBtn = document.getElementById('logout-btn');
    const dropdownLogout = document.getElementById('dropdown-logout');
    
    // Oturum kontrolü
    function checkSession() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        const username = sessionStorage.getItem('adminUsername');
        
        // Oturum yoksa login sayfasına yönlendir
        if (!isLoggedIn && !window.location.href.includes('index.html')) {
            window.location.href = 'index.html';
            return;
        }
        
        // Login sayfasında ama oturum açıksa dashboard'a yönlendir
        if (isLoggedIn && window.location.href.includes('index.html')) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Admin adını güncelle
        if (adminName && username) {
            adminName.textContent = username;
        }
    }
    
    // Sayfa yüklendiğinde oturum kontrolü yap
    checkSession();
    
    // Mobil menü açma/kapama
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('mobile-active');
        });
    }
    
    // Admin kullanıcı dropdown toggle
    if (adminUser) {
        adminUser.addEventListener('click', (e) => {
            e.stopPropagation(); // Tıklamanın body'ye geçmesini engelle
            adminUserDropdown.classList.toggle('active');
        });
        
        // Dropdown dışına tıklandığında kapat
        document.body.addEventListener('click', () => {
            if (adminUserDropdown.classList.contains('active')) {
                adminUserDropdown.classList.remove('active');
            }
        });
    }
    
    // Çıkış yap
    function logout() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'index.html';
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    if (dropdownLogout) {
        dropdownLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Bildirim gösterme
    window.showAdminNotification = function(message, type = 'info') {
        // Zaten bir bildirim varsa kaldır
        const existingNotification = document.querySelector('.admin-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Yeni bildirim oluştur
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.textContent = message;
        
        // Bildirim stillerini ayarla
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '4px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem'
        });
        
        // Bildirim türüne göre renkleri ayarla
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#2ecc71';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f39c12';
                notification.style.color = 'white';
                break;
            default:
                notification.style.backgroundColor = '#3498db';
                notification.style.color = 'white';
                break;
        }
        
        // Bildirimi sayfaya ekle
        document.body.appendChild(notification);
        
        // Animasyon
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // 3 saniye sonra kaldır
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    };
    
    // Tarih formatlama
    window.formatDate = function(dateString) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };
    
    // Para birimi formatlama
    window.formatCurrency = function(amount) {
        return amount.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };
    
    // API İsteği gönderme (localStorage ile entegre)
    window.apiRequest = function(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            // Bu bir örnek uygulama olduğu için API yerine localStorage kullanıyoruz
            
            setTimeout(() => {
                try {
                    let result;
                    switch (endpoint) {
                        case 'products':
                            // ProductDB sınıfından ürünleri al
                            if (window.productDB) {
                                result = window.productDB.getAllProducts();
                            } else {
                                // ProductDB yoksa varsayılan products değişkenini kullan
                                result = products || [];
                            }
                            break;
                        case 'orders':
                            // Orders verilerini localStorage'dan al
                            result = JSON.parse(localStorage.getItem('orders')) || [];
                            break;
                        case 'customers':
                            // Customers verilerini localStorage'dan al
                            result = JSON.parse(localStorage.getItem('customers')) || [];
                            break;
                        default:
                            result = [];
                    }
                    
                    if (method === 'POST' && data) {
                        // Veri ekle
                        if (endpoint === 'products' && window.productDB) {
                            // ProductDB üzerinden ürün ekle
                            result = window.productDB.addProduct(data);
                        } else {
                            // Diğer türler için normal ekleme
                            result.push(data);
                            localStorage.setItem(endpoint, JSON.stringify(result));
                        }
                    } else if (method === 'PUT' && data && data.id) {
                        // Veri güncelle
                        if (endpoint === 'products' && window.productDB) {
                            // ProductDB üzerinden ürün güncelle
                            result = window.productDB.updateProduct(data);
                        } else {
                            // Diğer türler için normal güncelleme
                            const index = result.findIndex(item => item.id === data.id);
                            if (index !== -1) {
                                result[index] = data;
                                localStorage.setItem(endpoint, JSON.stringify(result));
                            }
                        }
                    } else if (method === 'DELETE' && data && data.id) {
                        // Veri sil
                        if (endpoint === 'products' && window.productDB) {
                            // ProductDB üzerinden ürün sil
                            window.productDB.deleteProduct(data.id);
                            result = window.productDB.getAllProducts();
                        } else {
                            // Diğer türler için normal silme
                            result = result.filter(item => item.id !== data.id);
                            localStorage.setItem(endpoint, JSON.stringify(result));
                        }
                    }
                    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, 300); // API çağrısı simülasyonu için biraz gecikme ekledik
        });
    };
}); 