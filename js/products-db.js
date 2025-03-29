// Ürün Veritabanı Yöneticisi
// Bu modül ürünleri localStorage'da saklar ve yönetir

// Varsayılan ürün verileri - İlk yüklemede kullanılır
const defaultProducts = [
    {
        id: 1,
        name: "Elegance Clutch",
        price: 2499.99,
        description: "Zarif ve şık tasarımlı el çantası, özel geceler için ideal.",
        category: "clutch",
        stock: 15,
        featured: true,
        image: "../images/product1.jpg",
        gallery: [
            "../images/product1.jpg",
            "../images/product1-2.jpg",
            "../images/product1-3.jpg"
        ],
        reviews: [
            {
                user: "Elif K.",
                rating: 5,
                comment: "Kalitesi ve şıklığı ile beklentilerimi karşıladı."
            },
            {
                user: "Zeynep A.",
                rating: 4,
                comment: "Çok beğendim, sadece biraz daha büyük olmasını isterdim."
            }
        ]
    },
    // Test amaçlı yeni ürün
    {
        id: 9,
        name: "TEST - Admin Panel Çantası",
        price: 1.99,
        description: "Bu ürün admin panel testi için eklenmiştir.",
        category: "shoulder",
        stock: 999,
        featured: true,
        image: "../images/product1.jpg",
        gallery: [
            "../images/product1.jpg",
            "../images/product2.jpg",
            "../images/product3.jpg"
        ],
        reviews: [
            {
                user: "Admin Test",
                rating: 5,
                comment: "Bu bir test yorumudur."
            }
        ]
    },
    {
        id: 2,
        name: "Urban Chic Tote",
        price: 3299.99,
        description: "Günlük kullanım için ideal, geniş hacimli ve şık tote çanta.",
        category: "tote",
        stock: 8,
        featured: true,
        image: "../images/product2.jpg",
        gallery: [
            "../images/product2.jpg",
            "../images/product2-2.jpg",
            "../images/product2-3.jpg"
        ],
        reviews: [
            {
                user: "Ayşe M.",
                rating: 5,
                comment: "İş hayatım için mükemmel bir çanta, her şeyimi sığdırabiliyorum."
            }
        ]
    },
    {
        id: 3,
        name: "Crystal Evening Bag",
        price: 4199.99,
        description: "Kristal detaylı, lüks görünümlü gece çantası.",
        category: "clutch",
        stock: 5,
        featured: true,
        image: "../images/product3.jpg",
        gallery: [
            "../images/product3.jpg",
            "../images/product3-2.jpg"
        ],
        reviews: [
            {
                user: "Selin T.",
                rating: 5,
                comment: "Düğünümde kullandım, herkes çok beğendi!"
            },
            {
                user: "Deniz B.",
                rating: 4,
                comment: "Çok şık ve zarif."
            }
        ]
    },
    {
        id: 4,
        name: "Classic Shoulder Bag",
        price: 2799.99,
        description: "Klasik ve zamansız tasarıma sahip omuz çantası.",
        category: "shoulder",
        stock: 12,
        featured: true,
        image: "../images/product4.jpg",
        gallery: [
            "../images/product4.jpg",
            "../images/product4-2.jpg",
            "../images/product4-3.jpg"
        ],
        reviews: [
            {
                user: "Melis K.",
                rating: 5,
                comment: "Kaliteli malzeme ve dikişler, uzun yıllar kullanılabilecek bir ürün."
            }
        ]
    },
    {
        id: 5,
        name: "Modern Leather Crossbody",
        price: 1899.99,
        description: "Modern çizgilere sahip, pratik ve şık deri çapraz çanta.",
        category: "shoulder",
        stock: 20,
        featured: false,
        image: "../images/product5.jpg",
        gallery: [
            "../images/product5.jpg",
            "../images/product5-2.jpg"
        ],
        reviews: []
    },
    {
        id: 6,
        name: "Business Tote",
        price: 3599.99,
        description: "İş hayatı için tasarlanmış, laptop bölmeli tote çanta.",
        category: "tote",
        stock: 7,
        featured: false,
        image: "../images/product6.jpg",
        gallery: [
            "../images/product6.jpg",
            "../images/product6-2.jpg"
        ],
        reviews: [
            {
                user: "Canan D.",
                rating: 5,
                comment: "Hem şık hem fonksiyonel, iş toplantılarında çok beğeniliyor."
            }
        ]
    },
    {
        id: 7,
        name: "Weekend Shopper",
        price: 2499.99,
        description: "Hafta sonu kullanımı için ideal, geniş ve dayanıklı alışveriş çantası.",
        category: "tote",
        stock: 15,
        featured: false,
        image: "../images/product7.jpg",
        gallery: [
            "../images/product7.jpg"
        ],
        reviews: []
    },
    {
        id: 8,
        name: "Mini Crossbody",
        price: 1599.99,
        description: "Kompakt boyutlu, günlük kullanım için ideal çapraz çanta.",
        category: "shoulder",
        stock: 18,
        featured: false,
        image: "../images/product8.jpg",
        gallery: [
            "../images/product8.jpg",
            "../images/product8-2.jpg"
        ],
        reviews: []
    }
];

// ProductDB sınıfı - Ürün veritabanı yönetimi için
class ProductDB {
    constructor() {
        // LS ürün kontrolü yaparken ilk ürün ve toplam sayısını da kontrol edelim
        const productsInStorage = localStorage.getItem('products');
        const parsedProducts = productsInStorage ? JSON.parse(productsInStorage) : [];
        
        // Backend API kullanabiliyorsak oradan verileri çekelim
        if (window.backendAPI) {
            this.loadProductsFromAPI();
        } 
        // LS'de ürün yoksa veya geçersiz veri varsa varsayılan verileri kullan
        else if (!productsInStorage || parsedProducts.length === 0) {
            console.log('Varsayılan ürünler veritabanına yükleniyor...');
            localStorage.setItem('products', JSON.stringify(defaultProducts));
        }
        
        // Tarayıcıda localStorage'ı temizlemek için yardımcı metod (sadece geliştirme için)
        this.resetToDefaults = function() {
            localStorage.setItem('products', JSON.stringify(defaultProducts));
            console.log('Ürün veritabanı varsayılanlara sıfırlandı.');
            return defaultProducts;
        };
    }

    // API'den ürünleri yükle
    async loadProductsFromAPI() {
        try {
            const products = await window.backendAPI.getAllProducts();
            if (products && products.length > 0) {
                localStorage.setItem('products', JSON.stringify(products));
                console.log('Ürünler API\'den yüklendi');
                return products;
            } else {
                // API'den veri gelmezse varsayılan verileri kullan
                localStorage.setItem('products', JSON.stringify(defaultProducts));
                console.log('API\'den veri alınamadı, varsayılan ürünler kullanılıyor');
                return defaultProducts;
            }
        } catch (error) {
            console.error('API\'den ürünler yüklenirken hata:', error);
            // Hata durumunda localStorage'daki verileri kullan
            const productsInStorage = localStorage.getItem('products');
            if (productsInStorage) {
                return JSON.parse(productsInStorage);
            } else {
                // LocalStorage'da da veri yoksa varsayılanları kullan
                localStorage.setItem('products', JSON.stringify(defaultProducts));
                return defaultProducts;
            }
        }
    }
    
    // Tüm ürünleri getir
    getAllProducts() {
        // Önce API'den getirmeyi dene, yoksa localStorage'dan al
        if (window.backendAPI) {
            // Asenkron değil, yerel verilerle çalış
            return JSON.parse(localStorage.getItem('products')) || [];
        }
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    // ID'ye göre ürün getir
    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(product => product.id === id) || null;
    }

    // Öne çıkan ürünleri getir
    getFeaturedProducts() {
        const products = this.getAllProducts();
        return products.filter(product => product.featured);
    }

    // Kategoriye göre ürünleri getir
    getProductsByCategory(category) {
        const products = this.getAllProducts();
        return products.filter(product => product.category === category);
    }

    // Yeni ürün ekle
    async addProduct(product) {
        if (window.backendAPI) {
            try {
                // Önce API'ye ekle
                const addedProduct = await window.backendAPI.addProduct(product);
                
                // Başarılıysa localStorage'ı güncelle
                if (addedProduct) {
                    const products = this.getAllProducts();
                    products.push(addedProduct);
                    localStorage.setItem('products', JSON.stringify(products));
                    return addedProduct;
                }
            } catch (error) {
                console.error('Ürün eklenirken API hatası:', error);
                // API hatası durumunda sadece localStorage'a ekle
            }
        }
        
        // API yoksa veya hata durumunda localStorage'a ekle
        const products = this.getAllProducts();
        
        // Yeni ID oluştur - en yüksek ID'nin bir fazlası
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        product.id = maxId + 1;
        
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        return product;
    }

    // Ürün güncelle
    async updateProduct(product) {
        if (window.backendAPI) {
            try {
                // Önce API'de güncelle
                const updatedProduct = await window.backendAPI.updateProduct(product);
                
                // Başarılıysa localStorage'ı güncelle
                if (updatedProduct) {
                    const products = this.getAllProducts();
                    const index = products.findIndex(p => p.id === product.id);
                    
                    if (index !== -1) {
                        products[index] = updatedProduct;
                        localStorage.setItem('products', JSON.stringify(products));
                        return updatedProduct;
                    }
                }
            } catch (error) {
                console.error('Ürün güncellenirken API hatası:', error);
                // API hatası durumunda sadece localStorage'u güncelle
            }
        }
        
        // API yoksa veya hata durumunda localStorage'u güncelle
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === product.id);
        
        if (index !== -1) {
            products[index] = product;
            localStorage.setItem('products', JSON.stringify(products));
            return product;
        }
        
        return null;
    }

    // Ürün sil
    async deleteProduct(id) {
        if (window.backendAPI) {
            try {
                // Önce API'den sil
                const result = await window.backendAPI.deleteProduct(id);
                
                // Başarılıysa localStorage'ı güncelle
                if (result && result.success) {
                    const products = this.getAllProducts();
                    const newProducts = products.filter(p => p.id !== id);
                    
                    if (newProducts.length < products.length) {
                        localStorage.setItem('products', JSON.stringify(newProducts));
                        return true;
                    }
                }
            } catch (error) {
                console.error('Ürün silinirken API hatası:', error);
                // API hatası durumunda sadece localStorage'dan sil
            }
        }
        
        // API yoksa veya hata durumunda localStorage'dan sil
        const products = this.getAllProducts();
        const newProducts = products.filter(p => p.id !== id);
        
        if (newProducts.length < products.length) {
            localStorage.setItem('products', JSON.stringify(newProducts));
            return true;
        }
        
        return false;
    }

    // Ürün ara
    searchProducts(query) {
        query = query.toLowerCase();
        const products = this.getAllProducts();
        
        return products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
    }
}

// Global olarak kullanılabilir ProductDB nesnesi
window.productDB = new ProductDB(); 