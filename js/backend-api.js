// Backend API Entegrasyonu
// Bu dosya, canlı sunucuda veritabanı ile iletişim kurmak için gerekli fonksiyonları içerir

// API bağlantı bilgileri
const API_CONFIG = {
    // Gerçek sunucu URL'inizi buraya ekleyin
    // Örnek: "https://api.luxbag.com" veya "https://sizindomain.com/api"
    BASE_URL: "/api", // Vercel deployment için relative path kullanıyoruz
    
    // API versiyonu - Vercel için gerekli değil, boş bırakıyoruz
    VERSION: "",
    
    // API Endpoint'leri
    ENDPOINTS: {
        PRODUCTS: "/products",
        ORDERS: "/orders",
        CUSTOMERS: "/customers",
        AUTH: "/auth"
    },
    
    // API Token'ı (isteğe bağlı, kimlik doğrulama gerekliyse)
    TOKEN: localStorage.getItem('api_token') || null
};

// BackendAPI Sınıfı
class BackendAPI {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL + (API_CONFIG.VERSION ? "/" + API_CONFIG.VERSION : "");
        this.token = API_CONFIG.TOKEN;
        
        // LocalStorage'a geri dönüş (fallback) özelliği
        this.useLocalStorage = true; // Sunucu bağlantısı başarısız olursa localStorage kullan
        
        // Vercel'de deploy edilip edilmediğini kontrol et
        this.isVercelDeployment = this.checkIfVercelDeployment();
        console.log("Vercel deployment:", this.isVercelDeployment);
        
        // Vercel'de deploy edildiyse ve API bağlantısı yoksa, localStorage kullan
        if (this.isVercelDeployment) {
            console.log("Vercel deployment: Using localStorage for data storage");
        }
    }
    
    // Vercel'de deploy edilip edilmediğini kontrol et
    checkIfVercelDeployment() {
        // Vercel'in otomatik olarak eklediği ortam değişkenlerini kontrol et
        return typeof window !== 'undefined' && 
               (window.location.hostname.endsWith('vercel.app') || 
                window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1');
    }
    
    // API'ye istek gönderme metodu
    async request(endpoint, method = 'GET', data = null) {
        // Eğer Vercel deployment ise ve gerçek bir API bağlantısı yoksa, direkt localStorage kullan
        if (this.isVercelDeployment) {
            console.log(`Vercel deployment: Using localStorage for ${method} ${endpoint}`);
            return this.localStorageFallback(endpoint, method, data);
        }
        
        const url = this.baseUrl + endpoint;
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // Token varsa, Authorization header'ı ekle
        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        // POST, PUT gibi metotlar için body ekle
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            // Fetch API ile istek gönder
            const response = await fetch(url, options);
            
            // HTTP hatası kontrol et
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error("API request failed:", error);
            
            // Sunucu bağlantısı başarısız olursa ve localStorage kullanılması isteniyorsa
            if (this.useLocalStorage) {
                console.warn("Using localStorage as fallback");
                return this.localStorageFallback(endpoint, method, data);
            }
            
            throw error;
        }
    }
    
    // LocalStorage'a geri dönüş metodu
    localStorageFallback(endpoint, method, data) {
        // Endpoint'i analiz et
        const path = endpoint.split('/');
        const resource = path[1]; // "/products" -> "products"
        
        // localStorage'dan veri oku
        let result;
        switch (resource) {
            case 'products':
                if (window.productDB) {
                    if (method === 'GET') {
                        // ID belirtilmişse, tek ürün getir
                        if (path.length > 2 && path[2]) {
                            const id = parseInt(path[2]);
                            return window.productDB.getProductById(id);
                        }
                        
                        // Tüm ürünleri getir
                        return window.productDB.getAllProducts();
                    } else if (method === 'POST') {
                        // Yeni ürün ekle
                        return window.productDB.addProduct(data);
                    } else if (method === 'PUT' && data && data.id) {
                        // Ürün güncelle
                        return window.productDB.updateProduct(data);
                    } else if (method === 'DELETE' && path.length > 2) {
                        // Ürün sil
                        const id = parseInt(path[2]);
                        const success = window.productDB.deleteProduct(id);
                        return { success };
                    }
                }
                break;
                
            // Diğer kaynaklar için localStorage kullanımı buradan genişletilebilir
            // case 'orders':
            // case 'customers':
        }
        
        return null;
    }
    
    // ------------------------------------------------
    // Ürün API Metotları
    // ------------------------------------------------
    
    // Tüm ürünleri getir
    async getAllProducts() {
        return await this.request(API_CONFIG.ENDPOINTS.PRODUCTS);
    }
    
    // ID'ye göre ürün getir
    async getProductById(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
    }
    
    // Yeni ürün ekle
    async addProduct(productData) {
        return await this.request(API_CONFIG.ENDPOINTS.PRODUCTS, 'POST', productData);
    }
    
    // Ürün güncelle
    async updateProduct(productData) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${productData.id}`, 'PUT', productData);
    }
    
    // Ürün sil
    async deleteProduct(id) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`, 'DELETE');
    }
    
    // Ürün ara
    async searchProducts(query) {
        return await this.request(`${API_CONFIG.ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`);
    }
    
    // ------------------------------------------------
    // Sipariş API Metotları
    // ------------------------------------------------
    
    // Tüm siparişleri getir
    async getAllOrders() {
        return await this.request(API_CONFIG.ENDPOINTS.ORDERS);
    }
    
    // Yeni sipariş oluştur
    async createOrder(orderData) {
        return await this.request(API_CONFIG.ENDPOINTS.ORDERS, 'POST', orderData);
    }
    
    // ------------------------------------------------
    // Kullanıcı API Metotları
    // ------------------------------------------------
    
    // Giriş yap
    async login(username, password) {
        // Vercel deployment için özel kodlar
        if (this.isVercelDeployment) {
            // Geçici test giriş bilgileri
            if (username === 'admin' && password === 'admin123') {
                const testResponse = {
                    token: 'test-token-for-vercel-deployment',
                    user: {
                        username: 'admin',
                        role: 'admin'
                    }
                };
                this.token = testResponse.token;
                localStorage.setItem('api_token', testResponse.token);
                localStorage.setItem('user', JSON.stringify(testResponse.user));
                return testResponse;
            } else {
                throw new Error('Geçersiz kullanıcı adı veya şifre');
            }
        }
        
        // Normal API çağrısı
        const response = await this.request(`${API_CONFIG.ENDPOINTS.AUTH}/login`, 'POST', {
            username,
            password
        });
        
        if (response && response.token) {
            // Token'ı kaydet
            this.token = response.token;
            localStorage.setItem('api_token', response.token);
            
            // Kullanıcı bilgilerini de kaydet
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }
        }
        
        return response;
    }
    
    // Çıkış yap
    logout() {
        this.token = null;
        localStorage.removeItem('api_token');
        localStorage.removeItem('user');
        
        return { success: true };
    }
}

// Global BackendAPI nesnesi
window.backendAPI = new BackendAPI(); 