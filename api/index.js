// API endpoint for Vercel deployment

// Default products data for API response
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
    id: 9,
    name: "Vercel Demo Çantası",
    price: 1.99,
    description: "Bu ürün Vercel deployment testi için eklenmiştir.",
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
        user: "Vercel Demo",
        rating: 5,
        comment: "Bu bir demo ürünüdür."
      }
    ]
  }
];

// Simulated login credentials for demo
const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// Main API handler
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get path from URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(part => part);
  
  // Remove 'api' from path if present
  if (pathParts[0] === 'api') {
    pathParts.shift();
  }
  
  const resource = pathParts[0];
  const id = pathParts[1];
  
  // Route requests
  switch (resource) {
    case 'products':
      return handleProducts(req, res, id);
    case 'auth':
      return handleAuth(req, res, pathParts[1]);
    default:
      return res.status(404).json({ error: 'Resource not found' });
  }
}

// Handle product-related requests
function handleProducts(req, res, id) {
  switch (req.method) {
    case 'GET':
      if (id) {
        // Get single product
        const product = defaultProducts.find(p => p.id === parseInt(id, 10));
        if (product) {
          return res.status(200).json(product);
        }
        return res.status(404).json({ error: 'Product not found' });
      } else {
        // Get all products or search
        const searchQuery = req.query.q;
        if (searchQuery) {
          const results = defaultProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.description.toLowerCase().includes(searchQuery.toLowerCase()));
          return res.status(200).json(results);
        }
        return res.status(200).json(defaultProducts);
      }
    
    case 'POST':
      // In a real app, this would create a new product
      return res.status(201).json({ 
        ...req.body, 
        id: Math.max(...defaultProducts.map(p => p.id)) + 1 
      });
    
    case 'PUT':
      // In a real app, this would update an existing product
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      return res.status(200).json({ ...req.body });
    
    case 'DELETE':
      // In a real app, this would delete a product
      if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      return res.status(200).json({ success: true });
    
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Handle authentication-related requests
function handleAuth(req, res, action) {
  if (action !== 'login' || req.method !== 'POST') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  try {
    const { username, password } = req.body;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
      return res.status(200).json({
        token: 'demo-token-for-vercel-deployment',
        user: {
          username: adminCredentials.username,
          role: 'admin'
        }
      });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
} 