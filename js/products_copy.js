// ÃœrÃ¼n Verileri
const products = [
    {
        id: 1,
        name: "Elegance Clutch",
        price: 2499.99,
        description: "Zarif ve ÅŸÄ±k tasarÄ±mlÄ± el Ã§antasÄ±, Ã¶zel geceler iÃ§in ideal.",
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
                comment: "Kalitesi ve ÅŸÄ±klÄ±ÄŸÄ± ile beklentilerimi karÅŸÄ±ladÄ±."
            },
            {
                user: "Zeynep A.",
                rating: 4,
                comment: "Ã‡ok beÄŸendim, sadece biraz daha bÃ¼yÃ¼k olmasÄ±nÄ± isterdim."
            }
        ]
    },
    // Test amaÃ§lÄ± yeni Ã¼rÃ¼n
    {
        id: 9,
        name: "TEST - Admin Panel Ã‡antasÄ±",
        price: 1.99,
        description: "Bu Ã¼rÃ¼n admin panel testi iÃ§in eklenmiÅŸtir.",
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
        description: "GÃ¼nlÃ¼k kullanÄ±m iÃ§in ideal, geniÅŸ hacimli ve ÅŸÄ±k tote Ã§anta.",
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
                user: "AyÅŸe M.",
                rating: 5,
                comment: "Ä°ÅŸ hayatÄ±m iÃ§in mÃ¼kemmel bir Ã§anta, her ÅŸeyimi sÄ±ÄŸdÄ±rabiliyorum."
            }
        ]
    },
    {
        id: 3,
        name: "Crystal Evening Bag",
        price: 4199.99,
        description: "Kristal detaylÄ±, lÃ¼ks gÃ¶rÃ¼nÃ¼mlÃ¼ gece Ã§antasÄ±.",
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
                comment: "DÃ¼ÄŸÃ¼nÃ¼mde kullandÄ±m, herkes Ã§ok beÄŸendi!"
            },
            {
                user: "Deniz B.",
                rating: 4,
                comment: "Ã‡ok ÅŸÄ±k ve zarif."
            }
        ]
    },
    {
        id: 4,
        name: "Classic Shoulder Bag",
        price: 2799.99,
        description: "Klasik ve zamansÄ±z tasarÄ±ma sahip omuz Ã§antasÄ±.",
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
                comment: "Kaliteli malzeme ve dikiÅŸler, uzun yÄ±llar kullanÄ±labilecek bir Ã¼rÃ¼n."
            }
        ]
    },
    {
        id: 5,
        name: "Modern Leather Crossbody",
        price: 1899.99,
        description: "Modern Ã§izgilere sahip, pratik ve ÅŸÄ±k deri Ã§apraz Ã§anta.",
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
        description: "Ä°ÅŸ hayatÄ± iÃ§in tasarlanmÄ±ÅŸ, laptop bÃ¶lmeli tote Ã§anta.",
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
                comment: "Hem ÅŸÄ±k hem fonksiyonel, iÅŸ toplantÄ±larÄ±nda Ã§ok beÄŸeniliyor."
            }
        ]
    },
    {
        id: 7,
        name: "Weekend Shopper",
        price: 2499.99,
        description: "Hafta sonu kullanÄ±mÄ± iÃ§in ideal, geniÅŸ ve dayanÄ±klÄ± alÄ±ÅŸveriÅŸ Ã§antasÄ±.",
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
        description: "Kompakt boyutlu, gÃ¼nlÃ¼k kullanÄ±m iÃ§in ideal Ã§apraz Ã§anta.",
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

// Ã–ne Ã§Ä±kan Ã¼rÃ¼nleri yÃ¼kleme
document.addEventListener('DOMContentLoaded', () => {
    const featuredContainer = document.getElementById('featured-products');
    
    if (featuredContainer) {
        // Ã–ne Ã§Ä±kan Ã¼rÃ¼nleri filtrele
        const featuredProducts = products.filter(product => product.featured);
        
        // EÄŸer Ã¶ne Ã§Ä±kan Ã¼rÃ¼n yoksa rastgele 4 Ã¼rÃ¼n gÃ¶ster
        const productsToShow = featuredProducts.length > 0 ? 
            featuredProducts : 
            products.sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // ÃœrÃ¼nleri DOM'a ekle
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image.replace('../', '')}" alt="${product.name}">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                    })}</p>
                    <button class="btn-small add-to-cart" data-id="${product.id}">Sepete Ekle</button>
                </div>
            `;
            
            featuredContainer.appendChild(productCard);
        });
        
        // Sepete ekle butonlarÄ±na event listener ekle
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
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
});

// Test amaÃ§lÄ± yeni Ã¼rÃ¼n ekleme iÅŸlemi tamamlandÄ±

 
