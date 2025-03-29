# LuxBag - Lüks Çanta E-Ticaret Sitesi

Modern tasarımlı, kullanıcı dostu lüks çanta e-ticaret platformu.

## Özellikler

- Şık ve modern kullanıcı arayüzü
- Responsive tasarım (mobil ve masaüstü uyumlu)
- Kullanıcı dostu admin paneli
- Ürün yönetimi sistemi
- Sepet ve sipariş sistemi
- Ürün arama ve filtreleme
- LocalStorage tabanlı veri saklama (Geliştirme ortamı için)
- Backend API entegrasyonu (Canlı ortam için)

## Geliştirme Ortamı Kurulumu

1. Projeyi klonlayın:
   ```
   git clone https://github.com/yourusername/luxbag.git
   ```

2. Herhangi bir yerel sunucu ile çalıştırın (örn. Live Server, XAMPP, vb.)

3. Tarayıcıda açın:
   ```
   http://localhost:5500/luxury-bags/index.html
   ```

4. Admin paneline erişim:
   ```
   http://localhost:5500/luxury-bags/admin/index.html
   ```
   
   Test kullanıcı bilgileri:
   - Kullanıcı adı: test
   - Şifre: test

## Canlıya Geçiş Kılavuzu

### 1. Backend API Yapılandırması

`js/backend-api.js` dosyasını düzenleyin:

```javascript
const API_CONFIG = {
    BASE_URL: "https://sizin-api-adresiniz.com",
    VERSION: "v1",
    // Diğer ayarlar...
};
```

### 2. Test Modunu Devre Dışı Bırakma

`admin/js/admin-login.js` dosyasında:

```javascript
const isTestMode = false; // Test modunu kapatın
```

### 3. SSL Sertifikası

Canlı sunucunuzda SSL sertifikası kurduğunuzdan emin olun. Güvenli bir e-ticaret sitesi için HTTPS gereklidir.

### 4. Sunucuya Yükleme

FTP veya kontrol paneliniz üzerinden dosyaları sunucuya yükleyin. Dosya izinlerini doğru şekilde ayarladığınızdan emin olun.

### 5. Veritabanı Yapılandırması

Backend API yapılandırmanıza uygun bir veritabanı kurun. Varsayılan ürün verilerini veritabanına aktarın.

### 6. Ödeme Entegrasyonu

Gerçek bir e-ticaret sitesi için ödeme entegrasyonu eklemelisiniz. Bu proje şablon olarak hazırlanmıştır ve gerçek ödeme işlemi içermez.

## Kullanım

### Müşteri Kullanımı

- Ana sayfa: Öne çıkan ürünleri ve kategorileri görüntüleyin
- Koleksiyon: Tüm ürünleri filtreleyin ve görüntüleyin
- Arama: Ürün adı, açıklama veya kategoriye göre arama yapın
- Sepet: Ürünleri sepete ekleyin ve siparişinizi tamamlayın

### Admin Kullanımı

- Dashboard: Siparişler, satışlar ve stok durumu hakkında genel bilgi görüntüleyin
- Ürün Yönetimi: Ürünleri ekleyin, düzenleyin ve silin
- Sipariş Yönetimi: Siparişleri görüntüleyin ve durumlarını güncelleyin

## Teknik Detaylar

### Kullanılan Teknolojiler

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap benzeri modern CSS framework
- FontAwesome ikonlar
- Responsive tasarım için media queries
- LocalStorage ve SessionStorage
- Fetch API
- Async/Await

### Kod Yapısı

- `/js`: JavaScript dosyaları
  - `app.js`: Ana uygulama kodu
  - `products-db.js`: Ürün veritabanı yönetimi
  - `backend-api.js`: Backend API entegrasyonu
  - `products.js`: Ürün görüntüleme ve işlemleri
  - `collection.js`: Ürün koleksiyonu ve filtreleme

- `/css`: CSS dosyaları
  - `style.css`: Ana stil dosyası
  - `admin.css`: Admin panel stilleri

- `/admin`: Admin panel dosyaları
  - `js/admin-*.js`: Admin panel JavaScript dosyaları
  - `*.html`: Admin panel HTML sayfaları

- `/pages`: Site sayfaları
  - `collection.html`: Ürün koleksiyonu sayfası
  - `search-results.html`: Arama sonuçları sayfası
  - `cart.html`: Sepet sayfası
  - `product-detail.html`: Ürün detay sayfası

## Lisans

MIT License

## İletişim

Destek ve iletişim için: örnek@luxbag.com 