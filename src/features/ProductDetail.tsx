import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { productApi } from '../backend/api/productApi';
import type { Product } from './ProductCatalog';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product data
  React.useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await productApi.getProductById(id);
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading product details...</div>;
  }
  
  if (!product) {
    return <div className="flex justify-center p-8">Product not found</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
            <span className="text-gray-400">Product Image</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-24 flex items-center justify-center">
                <span className="text-gray-400 text-xs">Image {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600">Manufacturer: {product.manufacturer.name}</span>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-600">Rating: {product.manufacturer.rating}/5</span>
          </div>
          
          <div className="text-xl font-bold mb-4">
            {product.price.toLocaleString()} {product.currency}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-sm text-gray-600">
              Minimum Order Quantity: {product.minimumOrderQuantity} units
            </p>
            <p className="text-sm text-gray-600">
              Available Stock: {product.inventory} units
            </p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24">
              <Input
                type="number"
                min={product.minimumOrderQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            <Button className="flex-1">Add to Inquiry List</Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Shipping Information</h3>
              <p className="text-sm text-gray-600 mb-1">Ships from: {product.manufacturer.location}</p>
              <p className="text-sm text-gray-600 mb-1">International shipping available</p>
              <p className="text-sm text-gray-600">
                Lead time: 7-15 business days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Product Tabs */}
      <Tabs defaultValue="specifications" className="mt-12">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="manufacturer">Manufacturer Information</TabsTrigger>
          <TabsTrigger value="documents">Documents & Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specifications" className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium w-1/3">{key}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="manufacturer" className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">About {product.manufacturer.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-4">
                {product.manufacturer.name} is a leading manufacturer based in {product.manufacturer.location}
                specializing in high-quality products for international markets.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Founded: 2005</li>
                <li>Annual Revenue: $50M+</li>
                <li>Employees: 500+</li>
                <li>Export Markets: 35+ countries</li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <span className="text-gray-400">Manufacturer Logo</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4">View Manufacturer Profile</Button>
        </TabsContent>
        
        <TabsContent value="documents" className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Documents & Certificates</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 border rounded">
              <div className="flex-1">
                <p className="font-medium">Product Certification.pdf</p>
                <p className="text-sm text-gray-500">5.2 MB • PDF</p>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="flex items-center p-3 border rounded">
              <div className="flex-1">
                <p className="font-medium">Technical Manual.pdf</p>
                <p className="text-sm text-gray-500">12.7 MB • PDF</p>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="flex items-center p-3 border rounded">
              <div className="flex-1">
                <p className="font-medium">ISO Certification.pdf</p>
                <p className="text-sm text-gray-500">2.3 MB • PDF</p>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index}>
              <div className="h-40 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-400">Product Image</span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Related Product {index + 1}</h3>
                <p className="text-sm text-gray-500 mb-2">Sample Manufacturer</p>
                <p className="font-semibold">$XX.XX USD</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;