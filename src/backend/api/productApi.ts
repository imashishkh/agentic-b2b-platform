import { Product } from '../../features/ProductCatalog';

// Sample data for products
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Textile Machine',
    description: 'High-speed industrial textile manufacturing machine with advanced features for large-scale production',
    price: 15000,
    currency: 'USD',
    category: 'machinery',
    images: ['/placeholder.svg'],
    manufacturer: {
      id: 'mfr-1',
      name: 'TechFabrics Ltd',
      location: 'Mumbai, India',
      rating: 4.7
    },
    specifications: {
      'Dimensions': '240 x 180 x 210 cm',
      'Weight': '850 kg',
      'Power': '3-phase, 440V',
      'Capacity': '1500 units/day'
    },
    inventory: 24,
    minimumOrderQuantity: 1
  },
  {
    id: '2',
    name: 'Organic Cotton Fabric',
    description: 'Premium quality organic cotton fabric, GOTS certified, suitable for clothing and home textiles',
    price: 7.5,
    currency: 'USD',
    category: 'textiles',
    images: ['/placeholder.svg'],
    manufacturer: {
      id: 'mfr-2',
      name: 'EcoTextile Industries',
      location: 'Gujarat, India',
      rating: 4.9
    },
    specifications: {
      'Material': '100% Organic Cotton',
      'Weight': '180 GSM',
      'Width': '150 cm',
      'Certification': 'GOTS, Oeko-Tex'
    },
    inventory: 5000,
    minimumOrderQuantity: 500
  },
  {
    id: '3',
    name: 'PCB Assembly Machine',
    description: 'Automated PCB assembly machine for electronics manufacturing with precise component placement',
    price: 28000,
    currency: 'USD',
    category: 'electronics',
    images: ['/placeholder.svg'],
    manufacturer: {
      id: 'mfr-3',
      name: 'ElectroTech Solutions',
      location: 'Bangalore, India',
      rating: 4.6
    },
    specifications: {
      'Assembly Speed': 'Up to 12,000 CPH',
      'Accuracy': '±0.02mm',
      'Board Size': '50x50mm to 350x250mm',
      'Component Range': '0201 to 45x45mm'
    },
    inventory: 12,
    minimumOrderQuantity: 1
  }
];

// API methods for product management
export const productApi = {
  // Get all products with optional filtering
  getProducts: async (category?: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (category) {
      return sampleProducts.filter(product => product.category === category);
    }
    return sampleProducts;
  },
  
  // Get a single product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = sampleProducts.find(p => p.id === id);
    return product || null;
  },
  
  // Create a new product
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProduct = {
      ...product,
      id: `${sampleProducts.length + 1}`
    };
    return newProduct;
  },
  
  // Update an existing product
  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const productIndex = sampleProducts.findIndex(p => p.id === id);
    if (productIndex === -1) return null;
    
    const updatedProduct = {
      ...sampleProducts[productIndex],
      ...updates
    };
    return updatedProduct;
  },
  
  // Delete a product
  deleteProduct: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true; // Simulated successful deletion
  }
};

export default productApi;