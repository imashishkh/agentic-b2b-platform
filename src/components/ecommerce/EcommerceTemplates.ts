/**
 * Specialized templates for common e-commerce components 
 */

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'low' | 'medium' | 'high';
  language: string;
  code: string;
}

// Product-related components
export const productComponents: ComponentTemplate[] = [
  {
    id: 'product-card',
    name: 'Product Card',
    description: 'Display product information in a card format with add to cart functionality',
    category: 'product',
    complexity: 'low',
    language: 'typescript/react',
    code: `import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  id,
  name,
  price,
  image,
  description,
  onAddToCart 
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{name}</CardTitle>
        <p className="font-bold text-lg">\${price.toFixed(2)}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-sm text-gray-500">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(id)} 
          className="w-full"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;`
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    description: 'Display multiple products in a responsive grid layout',
    category: 'product',
    complexity: 'medium',
    language: 'typescript/react',
    code: `import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="h-[300px] animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          description={product.description}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;`
  },
  {
    id: 'product-details',
    name: 'Product Details Page',
    description: 'Detailed product view with description, images, and purchase options',
    category: 'product',
    complexity: 'high',
    language: 'typescript/react',
    code: `import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, MinusIcon } from "lucide-react";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface ProductDetailsProps {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  images: string[];
  variants?: ProductVariant[];
  onAddToCart: (productId: string, quantity: number, variantId?: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  id,
  name,
  description,
  features,
  price,
  images,
  variants = [],
  onAddToCart
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    variants.length > 0 ? variants[0].id : undefined
  );

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  const currentVariant = selectedVariant 
    ? variants.find(v => v.id === selectedVariant) 
    : undefined;
  
  const currentPrice = currentVariant ? currentVariant.price : price;
  const isInStock = currentVariant ? currentVariant.inStock : true;

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-white">
            <img
              src={images[selectedImage]}
              alt={name}
              className="h-[400px] w-full object-contain"
            />
          </div>
          
          <div className="flex space-x-2 overflow-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={\`h-20 w-20 rounded-md border \${
                  selectedImage === index ? 'ring-2 ring-blue-500' : ''
                }\`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={\`\${name} thumbnail \${index + 1}\`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="mt-2 text-2xl font-semibold">\${currentPrice.toFixed(2)}</p>
          </div>

          <p className="text-gray-600">{description}</p>

          {variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Options</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === variant.id ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant.id)}
                    disabled={!variant.inStock}
                    className="rounded-full"
                  >
                    {variant.name}
                    {!variant.inStock && " (Out of Stock)"}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => onAddToCart(id, quantity, selectedVariant)}
            disabled={!isInStock}
          >
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>

          <Separator />

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="features" className="flex-1">Features</TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <p className="text-sm">{description}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="list-inside list-disc space-y-2 text-sm">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <p className="text-sm">Free shipping on orders over $50. Standard delivery takes 3-5 business days.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;`
  },
];

// Cart-related components
export const cartComponents: ComponentTemplate[] = [
  {
    id: 'cart-item',
    name: 'Cart Item',
    description: 'Individual item in the shopping cart with quantity controls',
    category: 'cart',
    complexity: 'low',
    language: 'typescript/react',
    code: `import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove
}) => {
  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="h-16 w-16 overflow-hidden rounded-md border">
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">\${price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        
        <span className="w-8 text-center text-sm">{quantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(id, quantity + 1)}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="w-20 text-right">
        <p className="font-medium">\${(price * quantity).toFixed(2)}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500"
        onClick={() => onRemove(id)}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;`
  },
  {
    id: 'shopping-cart',
    name: 'Shopping Cart',
    description: 'Complete shopping cart with items, totals, and checkout button',
    category: 'cart',
    complexity: 'high',
    language: 'typescript/react',
    code: `import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBagIcon } from "lucide-react";
import CartItem from './CartItem';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout
}) => {
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button className="mt-8">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Shopping Cart ({items.length})</h2>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <CartItem
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  quantity={item.quantity}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
                <Separator />
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={onClear}>
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-medium">Order Summary</h3>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium">\${subtotal.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium">
                  {shipping === 0 ? "Free" : \`\$\${shipping.toFixed(2)}\`}
                </p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm font-medium">\${tax.toFixed(2)}</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <p className="font-medium">Total</p>
                <p className="font-bold">\${total.toFixed(2)}</p>
              </div>
              
              <Button className="mt-6 w-full" size="lg" onClick={onCheckout}>
                Proceed to Checkout
              </Button>
              
              <p className="mt-2 text-center text-xs text-gray-500">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;`
  },
  {
    id: 'mini-cart',
    name: 'Mini Cart',
    description: 'Compact cart dropdown for the header/navigation',
    category: 'cart',
    complexity: 'medium',
    language: 'typescript/react',
    code: `import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBagIcon, XIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface MiniCartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onViewCart: () => void;
  onCheckout: () => void;
}

export const MiniCart: React.FC<MiniCartProps> = ({
  items,
  onRemove,
  onViewCart,
  onCheckout
}) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBagIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <h3 className="font-medium">Your Cart ({totalItems})</h3>
        
        {items.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="my-4 max-h-64 space-y-4 overflow-y-auto py-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="h-14 w-14 overflow-hidden rounded-md border">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × \${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500"
                    onClick={() => onRemove(item.id)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="mt-4 flex justify-between">
              <p className="text-sm font-medium">Subtotal</p>
              <p className="text-sm font-bold">\${subtotal.toFixed(2)}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onViewCart}>
                View Cart
              </Button>
              <Button size="sm" onClick={onCheckout}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default MiniCart;`
  },
];

// Checkout-related components
export const checkoutComponents: ComponentTemplate[] = [
  {
    id: 'checkout-form',
    name: 'Checkout Form',
    description: 'Multi-step checkout process with shipping, billing, and payment',
    category: 'checkout',
    complexity: 'high',
    language: 'typescript/react',
    code: `import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardIcon, TruckIcon, CheckIcon } from "lucide-react";

interface CheckoutFormProps {
  cartItems: any[];
  onComplete: (orderData: any) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<string>("shipping");
  const [formData, setFormData] = useState({
    // Shipping info
    shippingFirstName: "",
    shippingLastName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
    
    // Billing info
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "US",
    
    // Payment info
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    
    // Shipping method
    shippingMethod: "standard"
  });
  
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = formData.shippingMethod === "express" ? 15.99 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    if (currentStep === "shipping") {
      // Copy shipping to billing if same as shipping is checked
      if (formData.sameAsShipping) {
        setFormData(prev => ({
          ...prev,
          billingFirstName: prev.shippingFirstName,
          billingLastName: prev.shippingLastName,
          billingEmail: prev.shippingEmail,
          billingPhone: prev.shippingPhone,
          billingAddress: prev.shippingAddress,
          billingCity: prev.shippingCity,
          billingState: prev.shippingState,
          billingZip: prev.shippingZip,
          billingCountry: prev.shippingCountry
        }));
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      setCurrentStep("review");
    } else if (currentStep === "review") {
      handleSubmitOrder();
    }
  };
  
  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping");
    } else if (currentStep === "review") {
      setCurrentStep("payment");
    }
  };
  
  const handleSubmitOrder = () => {
    // Process the order
    onComplete({
      shipping: {
        firstName: formData.shippingFirstName,
        lastName: formData.shippingLastName,
        email: formData.shippingEmail,
        phone: formData.shippingPhone,
        address: formData.shippingAddress,
        city: formData.shippingCity,
        state: formData.shippingState,
        zip: formData.shippingZip,
        country: formData.shippingCountry,
        method: formData.shippingMethod
      },
      billing: {
        firstName: formData.sameAsShipping ? formData.shippingFirstName : formData.billingFirstName,
        lastName: formData.sameAsShipping ? formData.shippingLastName : formData.billingLastName,
        email: formData.sameAsShipping ? formData.shippingEmail : formData.billingEmail,
        phone: formData.sameAsShipping ? formData.shippingPhone : formData.billingPhone,
        address: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        city: formData.sameAsShipping ? formData.shippingCity : formData.billingCity,
        state: formData.sameAsShipping ? formData.shippingState : formData.billingState,
        zip: formData.sameAsShipping ? formData.shippingZip : formData.billingZip,
        country: formData.sameAsShipping ? formData.shippingCountry : formData.billingCountry
      },
      payment: {
        method: formData.paymentMethod,
        // We'd normally not include full card details here,
        // just a token from the payment processor
        cardNumber: "****" + formData.cardNumber.slice(-4),
        cardName: formData.cardName
      },
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total
    });
  };
  
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" disabled={currentStep !== "shipping"}>
                <TruckIcon className="mr-2 h-4 w-4" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={currentStep !== "payment"}>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="review" disabled={currentStep !== "review"}>
                <CheckIcon className="mr-2 h-4 w-4" />
                Review
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="shipping" className="space-y-6 p-4">
              <div>
                <h2 className="text-xl font-semibold">Shipping Information</h2>
                <p className="text-sm text-gray-500">Enter your shipping details</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shippingFirstName">First Name</Label>
                  <Input
                    id="shippingFirstName"
                    name="shippingFirstName"
                    value={formData.shippingFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingLastName">Last Name</Label>
                  <Input
                    id="shippingLastName"
                    name="shippingLastName"
                    value={formData.shippingLastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingEmail">Email</Label>
                  <Input
                    id="shippingEmail"
                    name="shippingEmail"
                    type="email"
                    value={formData.shippingEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingPhone">Phone</Label>
                  <Input
                    id="shippingPhone"
                    name="shippingPhone"
                    type="tel"
                    value={formData.shippingPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="shippingAddress">Address</Label>
                  <Input
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">City</Label>
                  <Input
                    id="shippingCity"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingState">State / Province</Label>
                  <Input
                    id="shippingState"
                    name="shippingState"
                    value={formData.shippingState}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingZip">ZIP / Postal code</Label>
                  <Input
                    id="shippingZip"
                    name="shippingZip"
                    value={formData.shippingZip}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Country</Label>
                  <Input
                    id="shippingCountry"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Shipping Method</h3>
                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value) => handleRadioChange("shippingMethod", value)}
                  className="mt-4 space-y-3"
                >
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard-shipping" />
                      <Label htmlFor="standard-shipping" className="font-normal">
                        Standard Shipping (3-5 business days)
                      </Label>
                    </div>
                    <span className="font-medium">$5.99</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express-shipping" />
                      <Label htmlFor="express-shipping" className="font-normal">
                        Express Shipping (1-2 business days)
                      </Label>
                    </div>
                    <span className="font-medium">$15.99</span>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sameAsShipping"
                  checked={formData.sameAsShipping}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("sameAsShipping", checked as boolean)
                  }
                />
                <Label htmlFor="sameAsShipping" className="font-normal">
                  Billing address same as shipping address
                </Label>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleNext}>Continue to Payment</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-6 p-4">
              <div>
                <h2 className="text-xl font-semibold">Payment Information</h2>
                <p className="text-sm text-gray-500">Choose your payment method</p>
              </div>
              
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                className="space-y-3"
              >
                <div className="rounded-md border p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="font-normal">
                      Credit Card
                    </Label>
                  </div>
                  
                  {formData.paymentMethod === "credit-card" && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="rounded-md border p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="font-normal">
                      PayPal
                    </Label>
                  </div>
                  
                  {formData.paymentMethod === "paypal" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        You'll be redirected to PayPal to complete your purchase securely.
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
              
              {!formData.sameAsShipping && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium">Billing Information</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="billingFirstName">First Name</Label>
                        <Input
                          id="billingFirstName"
                          name="billingFirstName"
                          value={formData.billingFirstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingLastName">Last Name</Label>
                        <Input
                          id="billingLastName"
                          name="billingLastName"
                          value={formData.billingLastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="billingAddress">Address</Label>
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingState">State / Province</Label>
                        <Input
                          id="billingState"
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingZip">ZIP / Postal code</Label>
                        <Input
                          id="billingZip"
                          name="billingZip"
                          value={formData.billingZip}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">Country</Label>
                        <Input
                          id="billingCountry"
                          name="billingCountry"
                          value={formData.billingCountry}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back to Shipping
                </Button>
                <Button onClick={handleNext}>
                  Review Order
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-6 p-4">
              <div>
                <h2 className="text-xl font-semibold">Review Your Order</h2>
                <p className="text-sm text-gray-500">Please review your order before completing checkout</p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium">Shipping Information</h3>
                <div className="mt-2 text-sm">
                  <p>
                    {formData.shippingFirstName} {formData.shippingLastName}
                  </p>
                  <p>{formData.shippingAddress}</p>
                  <p>
                    {formData.shippingCity}, {formData.shippingState} {formData.shippingZip}
                  </p>
                  <p>{formData.shippingCountry}</p>
                  <p className="mt-1">{formData.shippingEmail}</p>
                  <p>{formData.shippingPhone}</p>
                </div>
                <p className="mt-2 font-medium">
                  Shipping Method: {formData.shippingMethod === "express" ? "Express" : "Standard"}
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium">Payment Information</h3>
                <div className="mt-2 text-sm">
                  <p>
                    Payment Method: {formData.paymentMethod === "credit-card" ? "Credit Card" : "PayPal"}
                  </p>
                  {formData.paymentMethod === "credit-card" && (
                    <>
                      <p className="mt-1">
                        Card: **** **** **** {formData.cardNumber.slice(-4)}
                      </p>
                      <p>Name on Card: {formData.cardName}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium">Order Summary</h3>
                <ul className="mt-2 divide-y">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p>{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p>\${(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>\${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>\${shipping.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax</p>
                    <p>\${tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <p>Total</p>
                    <p>\${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back to Payment
                </Button>
                <Button onClick={handleNext}>
                  Complete Order
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="rounded-md border p-6">
            <h3 className="text-lg font-medium">Order Summary</h3>
            
            <div className="mt-6 divide-y">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start space-x-4 py-3">
                  <div className="h-16 w-16 overflow-hidden rounded-md border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm">\${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              
              {cartItems.length > 3 && (
                <p className="py-2 text-center text-sm text-gray-500">
                  +{cartItems.length - 3} more items
                </p>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>\${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping</p>
                <p>\${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Tax</p>
                <p>\${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>\${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;`
  },
  {
    id: 'payment-methods',
    name: 'Payment Methods',
    description: 'Select and validate payment methods with credit card form',
    category: 'checkout',
    complexity: 'medium',
    language: 'typescript/react',
    code: `import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCardIcon, 
  PaypalIcon,
  ApplePayIcon,
  GooglePayIcon
} from "lucide-react";

interface PaymentMethodsProps {
  onPaymentMethodChange: (method: string, details?: any) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onPaymentMethodChange
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("credit-card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onPaymentMethodChange(value);
  };
  
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };
  
  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!cardDetails.number.trim()) {
      newErrors.number = "Card number is required";
    } else if (!/^\\d{13,19}$/.test(cardDetails.number.replace(/\\s/g, ""))) {
      newErrors.number = "Invalid card number";
    }
    
    if (!cardDetails.name.trim()) {
      newErrors.name = "Name on card is required";
    }
    
    if (!cardDetails.expiry.trim()) {
      newErrors.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\\/?([0-9]{2})$/.test(cardDetails.expiry)) {
      newErrors.expiry = "Invalid expiry date (MM/YY)";
    }
    
    if (!cardDetails.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }
    
    setErrors(newErrors);
    
    // If no errors, notify parent component
    if (Object.keys(newErrors).length === 0) {
      onPaymentMethodChange("credit-card", cardDetails);
      return true;
    }
    
    return false;
  };
  
  const handleSaveCard = () => {
    if (validateCard()) {
      console.log("Card details saved:", cardDetails);
    }
  };
  
  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedMethod}
        onValueChange={handleMethodChange}
        className="space-y-3"
      >
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="flex items-center space-x-2 font-normal">
              <CreditCardIcon className="h-5 w-5" />
              <span>Credit Card</span>
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center space-x-2 font-normal">
              <span role="img" aria-label="PayPal" className="text-[18px]">
                <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.779 7.163c.171-.979 0-1.641-.589-2.245c-.646-.653-1.817-.932-3.313-.932h-4.726c-.323 0-.608.231-.665.548l-1.969 12.415a.41.41 0 0 0 .095.302a.407.407 0 0 0 .285.118h3.432l-.19 1.198a.339.339 0 0 0 .07.263a.347.347 0 0 0 .247.104h2.866c.276 0 .513-.196.55-.467l.023-.114.436-2.73.28-.153c.038-.271.275-.467.551-.467h.347c2.246 0 4.006-.896 4.52-3.494c.214-1.087.104-1.994-.474-2.628c-.171-.2-.408-.364-.693-.493c.095-.322.171-.661.228-1.013z" fill="#009CDE"/>
                  <path d="M19.779 7.163c.171-.979 0-1.641-.589-2.245c-.646-.653-1.817-.932-3.313-.932h-4.726c-.323 0-.608.231-.665.548l-1.969 12.415a.41.41 0 0 0 .095.302a.407.407 0 0 0 .285.118h3.432l.858-5.372l-.28.167c.057-.317.333-.548.665-.548h1.388c2.721 0 4.854-1.087 5.474-4.222c.02-.85.029-.162.038-.247c-.167-.086-.342-.165-.531-.235c-.171.658-.399 1.38-.665 2.251z" fill="#012169"/>
                  <path d="M8.334 7.182a.347.347 0 0 1 .248-.104h3.935c.93 0 1.798.06 2.593.187c.228.039.447.086.655.142c.209.057.407.123.607.199c.104.039.2.086.304.133c.342.154.655.339.924.552c.172-.98 0-1.642-.589-2.245c-.646-.653-1.817-.932-3.314-.932H8.971c-.323 0-.608.231-.665.548L6.337 17.977a.41.41 0 0 0 .095.302a.408.408 0 0 0 .285.118h3.431l.858-5.372l.665-4.222c.01-.65.029-.122.057-.171h-.398z" fill="#003087"/>
                </svg>
              </span>
              <span>PayPal</span>
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="apple-pay" id="apple-pay" />
            <Label htmlFor="apple-pay" className="flex items-center space-x-2 font-normal">
              <span role="img" aria-label="Apple Pay" className="text-[18px]">
                <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.706 2.288C13.313 1.46 13.636 0.847 13.636 0C12.69 0.023 11.538 0.631 10.892 1.46C10.304 2.173 9.921 2.827 9.921 3.635C10.866 3.688 12.089 3.115 12.706 2.288ZM13.706 4.557C12.243 4.557 11.07 5.383 10.33 5.383C9.55 5.383 8.5 4.617 7.288 4.617C5.504 4.617 3.619 5.983 3.619 8.67C3.619 10.2 4.055 11.798 4.747 12.938C5.33 13.905 5.851 14.668 6.617 14.668C7.383 14.668 7.819 14.124 8.797 14.124C9.747 14.124 10.091 14.688 10.979 14.688C11.85 14.688 12.33 13.905 12.943 12.919C13.639 11.788 13.932 10.647 13.952 10.588C13.912 10.568 11.909 9.757 11.909 7.412C11.909 5.403 13.494 4.626 13.588 4.557C12.58 3.115 11.052 2.994 10.598 2.994C9.58 2.994 8.738 3.494 8.194 3.494C7.699 3.495 6.935 3.034 6.025 3.054" />
                </svg>
              </span>
              <span>Apple Pay</span>
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between rounded-md border p-4">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="google-pay" id="google-pay" />
            <Label htmlFor="google-pay" className="flex items-center space-x-2 font-normal">
              <span role="img" aria-label="Google Pay" className="text-[18px]">
                <svg viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.4848 10.1h-7.5v2.8h4.33c-.37 1.95-1.95 3-4.33 3a4.9 4.9 0 110-9.8c1.21 0 2.42.44 3.32 1.31l2.01-2.01A8.07 8.07 0 0012.9848 3a8 8 0 100 16 7.69 7.69 0 007.9-8.1c0-.26-.02-.7-.42-.8z" fill="#4285F4"/>
                  <path d="M5.3848 12a5.11 5.11 0 015.1-5.1c1.21 0 2.42.44 3.32 1.31l2.01-2.01A8.07 8.07 0 0010.4848 4a8 8 0 000 16c4.41 0 7.9-3.59 7.9-8 0-.26-.02-.7-.42-.8h-7.48v2.8h4.33c-.37 1.95-1.95 3-4.33 3a5.11 5.11 0 01-5.1-5" fill="#4285F4"/>
                </svg>
              </span>
              <span>Google Pay</span>
            </Label>
          </div>
        </div>
      </RadioGroup>
      
      {selectedMethod === "credit-card" && (
        <div className="mt-4 space-y-4 rounded-md border p-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="number"
              value={cardDetails.number}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              className={errors.number ? "border-red-500" : ""}
            />
            {errors.number && (
              <p className="text-xs text-red-500">{errors.number}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              name="name"
              value={cardDetails.name}
              onChange={handleCardInputChange}
              placeholder="John Smith"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Expiry Date</Label>
              <Input
                id="cardExpiry"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardInputChange}
                placeholder="MM/YY"
                className={errors.expiry ? "border-red-500" : ""}
              />
              {errors.expiry && (
                <p className="text-xs text-red-500">{errors.expiry}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV</Label>
              <Input
                id="cardCvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardInputChange}
                placeholder="123"
                maxLength={4}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && (
                <p className="text-xs text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          <div className="pt-2">
            <Button onClick={handleSaveCard} className="w-full">
              Save Card
            </Button>
          </div>
        </div>
      )}
      
      {selectedMethod === "paypal" && (
        <div className="rounded-md border p-4 text-center">
          <p className="mb-4 text-sm text-gray-500">
            You'll be redirected to PayPal to complete your purchase securely.
          </p>
          <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6]">
            Continue with PayPal
          </Button>
        </div>
      )}
      
      {selectedMethod === "apple-pay" && (
        <div className="rounded-md border p-4 text-center">
          <p className="mb-4 text-sm text-gray-500">
            Complete your purchase with Apple Pay.
          </p>
          <Button className="w-full bg-black hover:bg-gray-900">
            <span className="mr-2">
              <svg viewBox="0 0 24 24" width="24" height="24" className="inline-block h-5 w-5" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.706 2.288C13.313 1.46 13.636 0.847 13.636 0C12.69 0.023 11.538 0.631 10.892 1.46C10.304 2.173 9.921 2.827 9.921 3.635C10.866 3.688 12.089 3.115 12.706 2.288ZM13.706 4.557C12.243 4.557 11.07 5.383 10.33 5.383C9.55 5.383 8.5 4.617 7.288 4.617C5.504 4.617 3.619 5.983 3.619 8.67C3.619 10.2 4.055 11.798 4.747 12.938C5.33 13.905 5.851 14.668 6.617 14.668C7.383 14.668 7.819 14.124 8.797 14.124C9.747 14.124 10.091 14.688 10.979 14.688C11.85 14.688 12.33 13.905 12.943 12.919C13.639 11.788 13.932 10.647 13.952 10.588C13.912 10.568 11.909 9.757 11.909 7.412C11.909 5.403 13.494 4.626 13.588 4.557C12.58 3.115 11.052 2.994 10.598 2.994C9.58 2.994 8.738 3.494 8.194 3.494C7.699 3.495 6.935 3.034 6.025 3.054" />
              </svg>
            </span>
            Pay
          </Button>
        </div>
      )}
      
      {selectedMethod === "google-pay" && (
        <div className="rounded-md border p-4 text-center">
          <p className="mb-4 text-sm text-gray-500">
            Complete your purchase with Google Pay.
          </p>
          <Button className="w-full bg-white text-black hover:bg-gray-100">
            <span className="mr-2">
              <svg viewBox="0 0 24 24" width="24" height="24" className="inline-block h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.4848 10.1h-7.5v2.8h4.33c-.37 1.95-1.95 3-4.33 3a4.9 4.9 0 110-9.8c1.21 0 2.42.44 3.32 1.31l2.01-2.01A8.07 8.07 0 0012.9848 3a8 8 0 100 16 7.69 7.69 0 007.9-8.1c0-.26-.02-.7-.42-.8z" fill="#4285F4"/>
                <path d="M5.3848 12a5.11 5.11 0 015.1-5.1c1.21 0 2.42.44 3.32 1.31l2.01-2.01A8.07 8.07 0 0010.4848 4a8 8 0 000 16c4.41 0 7.9-3.59 7.9-8 0-.26-.02-.7-.42-.8h-7.48v2.8h4.33c-.37 1.95-1.95 3-4.33 3a5.11 5.11 0 01-5.1-5" fill="#4285F4"/>
              </svg>
            </span>
            Pay
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;`
  },
];

// Get all e-commerce templates
export const getAllTemplates = (): ComponentTemplate[] => {
  return [...productComponents, ...cartComponents, ...checkoutComponents];
};

// Get templates by category
export const getTemplatesByCategory = (category: string): ComponentTemplate[] => {
  switch (category) {
    case 'product':
      return productComponents;
    case 'cart':
      return cartComponents;
    case 'checkout':
      return checkoutComponents;
    default:
      return getAllTemplates();
  }
};

// Get template by ID
export const getTemplateById = (id: string): ComponentTemplate | undefined => {
  return getAllTemplates().find(template => template.id === id);
};