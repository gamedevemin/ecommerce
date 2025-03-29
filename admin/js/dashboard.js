document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const orderCountElem = document.getElementById('order-count');
    const revenueElem = document.getElementById('revenue');
    const productCountElem = document.getElementById('product-count');
    const customerCountElem = document.getElementById('customer-count');
    const recentOrdersTable = document.getElementById('recent-orders');
    const lowStockProductsTable = document.getElementById('low-stock-products');
    
    // Dashboard verilerini yükle
    loadDashboardData();
    
    // Dashboard verilerini yükleme
    async function loadDashboardData() {
        try {
            // Ürün verilerini yükle
            const productData = await window.apiRequest('products');
            
            // Sipariş verilerini yükle (localStorage simülasyonu)
            const orderData = await window.apiRequest('orders');
            
            // Müşteri verilerini yükle (localStorage simülasyonu)
            const customerData = await window.apiRequest('customers');
            
            // İstatistikleri güncelle
            updateStats(productData, orderData, customerData);
            
            // Son siparişleri göster
            showRecentOrders(orderData);
            
            // Düşük stoklu ürünleri göster
            showLowStockProducts(productData);
        } catch (error) {
            console.error('Dashboard verileri yüklenirken hata oluştu:', error);
            window.showAdminNotification('Veriler yüklenirken bir hata oluştu.', 'error');
        }
    }
    
    // İstatistikleri güncelleme
    function updateStats(products, orders, customers) {
        // Ürün sayısı
        if (productCountElem) {
            productCountElem.textContent = products.length;
        }
        
        // Sipariş sayısı ve toplam gelir
        if (orderCountElem && revenueElem) {
            // Demo için örnek veriler
            const orderCount = orders.length || 0;
            
            // Toplam gelir
            const totalRevenue = orders.reduce((total, order) => {
                return total + order.total;
            }, 0) || 0;
            
            orderCountElem.textContent = orderCount;
            revenueElem.textContent = window.formatCurrency(totalRevenue);
        }
        
        // Müşteri sayısı
        if (customerCountElem) {
            customerCountElem.textContent = customers.length || 0;
        }
    }
    
    // Son siparişleri gösterme
    function showRecentOrders(orders) {
        if (!recentOrdersTable) return;
        
        // Demo veri oluştur (gerçek bir uygulamada API'den gelir)
        if (!orders || orders.length === 0) {
            // Örnek sipariş verileri
            orders = [
                {
                    id: 1001,
                    customer: 'Ayşe Yılmaz',
                    date: '2023-03-15T14:30:00',
                    total: 2499.99,
                    status: 'Tamamlandı'
                },
                {
                    id: 1002,
                    customer: 'Mehmet Kaya',
                    date: '2023-03-14T10:15:00',
                    total: 3899.98,
                    status: 'İşleniyor'
                },
                {
                    id: 1003,
                    customer: 'Zeynep Demir',
                    date: '2023-03-13T16:45:00',
                    total: 1599.99,
                    status: 'Kargoya Verildi'
                },
                {
                    id: 1004,
                    customer: 'Ali Öztürk',
                    date: '2023-03-12T09:20:00',
                    total: 4199.99,
                    status: 'Tamamlandı'
                }
            ];
            
            // Demo verileri localStorage'a kaydet
            localStorage.setItem('orders', JSON.stringify(orders));
        }
        
        // Siparişleri sırala (en yeniden en eskiye)
        const sortedOrders = [...orders].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Sadece son 5 siparişi göster
        const recentOrders = sortedOrders.slice(0, 5);
        
        // Tablo içeriğini temizle
        recentOrdersTable.innerHTML = '';
        
        // Sipariş yoksa mesaj göster
        if (recentOrders.length === 0) {
            recentOrdersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Henüz sipariş bulunmuyor.</td>
                </tr>
            `;
            return;
        }
        
        // Siparişleri tabloya ekle
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            
            // Durum rengini belirle
            let statusClass;
            switch (order.status) {
                case 'Tamamlandı':
                    statusClass = 'success';
                    break;
                case 'İşleniyor':
                    statusClass = 'warning';
                    break;
                case 'Kargoya Verildi':
                    statusClass = 'info';
                    break;
                default:
                    statusClass = '';
            }
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${window.formatDate(order.date)}</td>
                <td>${window.formatCurrency(order.total)}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="edit-btn" data-id="${order.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${order.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            recentOrdersTable.appendChild(row);
        });
        
        // Sipariş düzenleme butonları
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const orderId = button.dataset.id;
                window.location.href = `order-detail.html?id=${orderId}`;
            });
        });
        
        // Sipariş silme butonları
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const orderId = parseInt(button.dataset.id);
                
                if (confirm('Bu siparişi silmek istediğinizden emin misiniz?')) {
                    try {
                        await window.apiRequest('orders', 'DELETE', { id: orderId });
                        window.showAdminNotification('Sipariş başarıyla silindi.', 'success');
                        loadDashboardData(); // Verileri yeniden yükle
                    } catch (error) {
                        window.showAdminNotification('Sipariş silinirken bir hata oluştu.', 'error');
                    }
                }
            });
        });
    }
    
    // Düşük stoklu ürünleri gösterme
    function showLowStockProducts(products) {
        if (!lowStockProductsTable) return;
        
        // Stok durumuna göre sırala (düşükten yükseğe)
        const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);
        
        // Sadece stok 10'un altında olan ürünleri filtrele ve ilk 5'ini al
        const lowStockProducts = sortedProducts
            .filter(product => product.stock < 10)
            .slice(0, 5);
        
        // Tablo içeriğini temizle
        lowStockProductsTable.innerHTML = '';
        
        // Düşük stoklu ürün yoksa mesaj göster
        if (lowStockProducts.length === 0) {
            lowStockProductsTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Düşük stoklu ürün bulunmuyor.</td>
                </tr>
            `;
            return;
        }
        
        // Ürünleri tabloya ekle
        lowStockProducts.forEach(product => {
            const row = document.createElement('tr');
            
            // Stok durumu rengi
            let stockStatusClass = product.stock <= 5 ? 'error' : 'warning';
            let stockStatus = product.stock <= 5 ? 'Kritik' : 'Düşük';
            
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${window.formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge ${stockStatusClass}">${stockStatus}</span></td>
            `;
            
            lowStockProductsTable.appendChild(row);
        });
    }
}); 