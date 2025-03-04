import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  manufacturer: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  specifications: Record<string, string>;
  inventory: number;
  minimumOrderQuantity: number;
}

export const ProductCatalog: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Catalog</h2>
        <Button>Add New Product</Button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Input className="flex-1" placeholder="Search products..." />
        <Select>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="textiles">Textiles</option>
          <option value="machinery">Machinery</option>
        </Select>
        <Button variant="outline">Filter</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-400">Product Image</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">Sample Product Name</CardTitle>
        <p className="text-sm text-gray-500 mb-2">Manufacturer: Sample Manufacturer</p>
        <p className="font-semibold mb-2">$100.00 USD</p>
        <p className="text-xs text-gray-500 mb-3">MOQ: 100 units</p>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">Details</Button>
          <Button size="sm" variant="outline" className="flex-1">Add to Inquiry</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCatalog;