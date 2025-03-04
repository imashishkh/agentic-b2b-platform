import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Label } from '../components/ui/label';
import { Check as CheckIcon } from 'lucide-react';

type OnboardingStep = 
  | 'account-type'
  | 'company-info'
  | 'business-verification'
  | 'product-categories'
  | 'compliance'
  | 'payment-setup'
  | 'profile-customization'
  | 'complete';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('account-type');
  const [accountType, setAccountType] = useState<'manufacturer' | 'distributor' | 'buyer' | ''>('');
  
  const progressPercentage = {
    'account-type': 0,
    'company-info': 16,
    'business-verification': 32,
    'product-categories': 48,
    'compliance': 64,
    'payment-setup': 80,
    'profile-customization': 96,
    'complete': 100
  };
  
  const nextStep = () => {
    switch (currentStep) {
      case 'account-type':
        setCurrentStep('company-info');
        break;
      case 'company-info':
        setCurrentStep('business-verification');
        break;
      case 'business-verification':
        setCurrentStep('product-categories');
        break;
      case 'product-categories':
        setCurrentStep('compliance');
        break;
      case 'compliance':
        setCurrentStep('payment-setup');
        break;
      case 'payment-setup':
        setCurrentStep('profile-customization');
        break;
      case 'profile-customization':
        setCurrentStep('complete');
        break;
    }
  };
  
  const prevStep = () => {
    switch (currentStep) {
      case 'company-info':
        setCurrentStep('account-type');
        break;
      case 'business-verification':
        setCurrentStep('company-info');
        break;
      case 'product-categories':
        setCurrentStep('business-verification');
        break;
      case 'compliance':
        setCurrentStep('product-categories');
        break;
      case 'payment-setup':
        setCurrentStep('compliance');
        break;
      case 'profile-customization':
        setCurrentStep('payment-setup');
        break;
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Setup Your B2B Profile</CardTitle>
            <div className="text-sm text-gray-500">
              Step {Object.keys(progressPercentage).indexOf(currentStep) + 1} of 8
            </div>
          </div>
          <Progress value={progressPercentage[currentStep]} className="h-2" />
        </CardHeader>
        
        <CardContent className="pt-6">
          {currentStep === 'account-type' && (
            <AccountTypeStep 
              accountType={accountType} 
              setAccountType={setAccountType} 
            />
          )}
          
          {currentStep === 'company-info' && (
            <CompanyInfoStep />
          )}
          
          {currentStep === 'business-verification' && (
            <BusinessVerificationStep />
          )}
          
          {currentStep === 'product-categories' && (
            <ProductCategoriesStep accountType={accountType} />
          )}
          
          {currentStep === 'compliance' && (
            <ComplianceStep accountType={accountType} />
          )}
          
          {currentStep === 'payment-setup' && (
            <PaymentSetupStep />
          )}
          
          {currentStep === 'profile-customization' && (
            <ProfileCustomizationStep />
          )}
          
          {currentStep === 'complete' && (
            <CompleteStep accountType={accountType} />
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          {currentStep !== 'account-type' && currentStep !== 'complete' && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          
          {currentStep === 'account-type' && (
            <div className="ml-auto">
              <Button onClick={nextStep} disabled={!accountType}>
                Continue
              </Button>
            </div>
          )}
          
          {currentStep !== 'account-type' && currentStep !== 'complete' && (
            <Button onClick={nextStep}>
              {currentStep === 'profile-customization' ? 'Complete Setup' : 'Continue'}
            </Button>
          )}
          
          {currentStep === 'complete' && (
            <Button onClick={() => window.location.href = '/dashboard'} className="ml-auto">
              Go to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

interface AccountTypeStepProps {
  accountType: string;
  setAccountType: (type: 'manufacturer' | 'distributor' | 'buyer' | '') => void;
}

const AccountTypeStep: React.FC<AccountTypeStepProps> = ({ accountType, setAccountType }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Your Account Type</h3>
      <p className="text-gray-500 mb-6">
        Choose the account type that best represents your business role in the marketplace.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer border-2 ${accountType === 'manufacturer' ? 'border-blue-500' : 'border-gray-200'}`}
          onClick={() => setAccountType('manufacturer')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v-4H7v4h8z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Manufacturer</h4>
              <p className="text-sm text-gray-500">
                You produce goods and want to connect with global buyers and distributors.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer border-2 ${accountType === 'distributor' ? 'border-blue-500' : 'border-gray-200'}`}
          onClick={() => setAccountType('distributor')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Distributor</h4>
              <p className="text-sm text-gray-500">
                You connect manufacturers with retailers and manage product distribution.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer border-2 ${accountType === 'buyer' ? 'border-blue-500' : 'border-gray-200'}`}
          onClick={() => setAccountType('buyer')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Buyer</h4>
              <p className="text-sm text-gray-500">
                You source products from manufacturers and distributors for your business.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CompanyInfoStep: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Company Information</h3>
      <p className="text-gray-500 mb-6">
        Provide details about your company to help us personalize your experience.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="company-name" className="block mb-2">Company Name</Label>
          <Input id="company-name" placeholder="Enter company name" />
        </div>
        
        <div>
          <Label htmlFor="year-established" className="block mb-2">Year Established</Label>
          <Input id="year-established" placeholder="e.g., 2005" type="number" />
        </div>
        
        <div>
          <Label htmlFor="company-website" className="block mb-2">Company Website</Label>
          <Input id="company-website" placeholder="https://yourcompany.com" />
        </div>
        
        <div>
          <Label htmlFor="company-size" className="block mb-2">Company Size</Label>
          <Select id="company-size">
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="company-description" className="block mb-2">Company Description</Label>
          <Textarea id="company-description" placeholder="Brief description of your company and what you do" className="resize-none h-32" />
        </div>
      </div>
    </div>
  );
};

const BusinessVerificationStep: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Business Verification</h3>
      <p className="text-gray-500 mb-6">
        Verify your business to build trust with potential partners and unlock full platform features.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="registration-number" className="block mb-2">Business Registration Number</Label>
          <Input id="registration-number" placeholder="Enter registration number" />
        </div>
        
        <div>
          <Label htmlFor="tax-id" className="block mb-2">Tax ID / VAT Number</Label>
          <Input id="tax-id" placeholder="Enter tax ID or VAT number" />
        </div>
        
        <div>
          <Label className="block mb-2">Business Registration Certificate</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop your business registration certificate or click to browse
            </p>
            <Button variant="outline" className="mt-4">Select File</Button>
          </div>
        </div>
        
        <div>
          <Label className="block mb-2">Additional Supporting Documents</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Optional: Trade licenses, manufacturing permits, export certificates, etc.
            </p>
            <Button variant="outline" className="mt-4">Select Files</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductCategoriesStepProps {
  accountType: string;
}

const ProductCategoriesStep: React.FC<ProductCategoriesStepProps> = ({ accountType }) => {
  const isManufacturer = accountType === 'manufacturer';
  const isDistributor = accountType === 'distributor';
  const isBuyer = accountType === 'buyer';
  
  const categories = [
    { id: 'textiles', name: 'Textiles & Fabrics' },
    { id: 'garments', name: 'Garments & Apparel' },
    { id: 'machinery', name: 'Industrial Machinery' },
    { id: 'electronics', name: 'Electronics & Components' },
    { id: 'furniture', name: 'Furniture & Home Goods' },
    { id: 'handicrafts', name: 'Handicrafts & Artisanal Products' },
    { id: 'food', name: 'Food & Agricultural Products' },
    { id: 'chemicals', name: 'Chemicals & Pharmaceuticals' },
    { id: 'automotive', name: 'Automotive Parts & Accessories' },
    { id: 'packaging', name: 'Packaging Materials' },
    { id: 'construction', name: 'Construction Materials' },
    { id: 'leather', name: 'Leather Goods' }
  ];
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {isManufacturer && 'Products You Manufacture'}
        {isDistributor && 'Products You Distribute'}
        {isBuyer && 'Products You Want to Source'}
      </h3>
      <p className="text-gray-500 mb-6">
        Select the product categories relevant to your business to help us connect you with the right partners.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map(category => (
          <div key={category.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" id={`category-${category.id}`} className="rounded" />
            <Label htmlFor={`category-${category.id}`} className="cursor-pointer">{category.name}</Label>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Label htmlFor="other-categories" className="block mb-2">Other Categories (Optional)</Label>
        <Textarea 
          id="other-categories" 
          placeholder="Please specify any other product categories not listed above" 
          className="resize-none h-20"
        />
      </div>
    </div>
  );
};

interface ComplianceStepProps {
  accountType: string;
}

const ComplianceStep: React.FC<ComplianceStepProps> = ({ accountType }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Compliance & Certifications</h3>
      <p className="text-gray-500 mb-6">
        Share your compliance information and certifications to establish credibility and meet international trade requirements.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label className="block mb-2">Select Your Certifications</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'iso9001', name: 'ISO 9001 - Quality Management' },
              { id: 'iso14001', name: 'ISO 14001 - Environmental Management' },
              { id: 'brc', name: 'BRC - British Retail Consortium' },
              { id: 'fsc', name: 'FSC - Forest Stewardship Council' },
              { id: 'gots', name: 'GOTS - Global Organic Textile Standard' },
              { id: 'fair-trade', name: 'Fair Trade Certified' },
              { id: 'ce', name: 'CE Marking' },
              { id: 'haccp', name: 'HACCP - Food Safety' }
            ].map(cert => (
              <div key={cert.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" id={`cert-${cert.id}`} className="rounded" />
                <Label htmlFor={`cert-${cert.id}`} className="cursor-pointer">{cert.name}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="export-markets" className="block mb-2">Primary Export Markets</Label>
          <Select id="export-markets" multiple={true} className="h-32">
            <option value="north-america">North America</option>
            <option value="europe">Europe</option>
            <option value="middle-east">Middle East</option>
            <option value="asia-pacific">Asia Pacific</option>
            <option value="africa">Africa</option>
            <option value="latin-america">Latin America</option>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple regions</p>
        </div>
        
        <div>
          <Label className="block mb-2">Certification Documents (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Upload copies of your certification documents to display on your profile
            </p>
            <Button variant="outline" className="mt-4">Select Files</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSetupStep: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Payment & Transaction Settings</h3>
      <p className="text-gray-500 mb-6">
        Set up your payment details and preferences for secure international transactions.
      </p>
      
      <Tabs defaultValue="bank-details">
        <TabsList className="mb-6 grid grid-cols-3 w-full">
          <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
          <TabsTrigger value="payment-terms">Payment Terms</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bank-details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank-name" className="block mb-2">Bank Name</Label>
                <Input id="bank-name" placeholder="Enter bank name" />
              </div>
              <div>
                <Label htmlFor="account-holder" className="block mb-2">Account Holder Name</Label>
                <Input id="account-holder" placeholder="Enter account holder name" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="account-number" className="block mb-2">Account Number / IBAN</Label>
              <Input id="account-number" placeholder="Enter account number or IBAN" />
            </div>
            
            <div>
              <Label htmlFor="swift-code" className="block mb-2">SWIFT/BIC Code</Label>
              <Input id="swift-code" placeholder="Enter SWIFT or BIC code" />
            </div>
            
            <div>
              <Label htmlFor="bank-address" className="block mb-2">Bank Address</Label>
              <Textarea id="bank-address" placeholder="Enter bank address" className="resize-none h-24" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payment-terms">
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-methods" className="block mb-2">Accepted Payment Methods</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'bank-transfer', name: 'Bank Transfer' },
                  { id: 'letter-of-credit', name: 'Letter of Credit (L/C)' },
                  { id: 'documentary-collection', name: 'Documentary Collection' },
                  { id: 'credit-card', name: 'Credit Card' },
                  { id: 'paypal', name: 'PayPal' },
                  { id: 'escrow', name: 'Escrow Service' }
                ].map(method => (
                  <div key={method.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" id={`method-${method.id}`} className="rounded" />
                    <Label htmlFor={`method-${method.id}`} className="cursor-pointer">{method.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="payment-terms" className="block mb-2">Standard Payment Terms</Label>
              <Select id="payment-terms">
                <option value="">Select payment terms</option>
                <option value="advance">100% Advance Payment</option>
                <option value="30-70">30% Advance, 70% Before Shipment</option>
                <option value="50-50">50% Advance, 50% Before Shipment</option>
                <option value="lc">Letter of Credit at Sight</option>
                <option value="30-days">Net 30 Days</option>
                <option value="60-days">Net 60 Days</option>
                <option value="custom">Custom Terms</option>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="custom-terms" className="block mb-2">Custom Payment Terms (Optional)</Label>
              <Textarea id="custom-terms" placeholder="Describe your custom payment terms" className="resize-none h-24" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="currencies">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-currency" className="block mb-2">Primary Currency</Label>
              <Select id="primary-currency">
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="inr">INR - Indian Rupee</option>
                <option value="aed">AED - UAE Dirham</option>
                <option value="jpy">JPY - Japanese Yen</option>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="accepted-currencies" className="block mb-2">Other Accepted Currencies</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { code: 'usd', name: 'US Dollar (USD)' },
                  { code: 'eur', name: 'Euro (EUR)' },
                  { code: 'gbp', name: 'British Pound (GBP)' },
                  { code: 'inr', name: 'Indian Rupee (INR)' },
                  { code: 'aed', name: 'UAE Dirham (AED)' },
                  { code: 'jpy', name: 'Japanese Yen (JPY)' },
                  { code: 'aud', name: 'Australian Dollar (AUD)' },
                  { code: 'cad', name: 'Canadian Dollar (CAD)' },
                  { code: 'sgd', name: 'Singapore Dollar (SGD)' }
                ].map(currency => (
                  <div key={currency.code} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" id={`currency-${currency.code}`} className="rounded" />
                    <Label htmlFor={`currency-${currency.code}`} className="cursor-pointer text-sm">{currency.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProfileCustomizationStep: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Profile Customization</h3>
      <p className="text-gray-500 mb-6">
        Complete your profile with additional information to stand out to potential business partners.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label className="block mb-2">Company Logo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Upload your company logo (recommended size: 400x400px)
            </p>
            <Button variant="outline" className="mt-4">Select Image</Button>
          </div>
        </div>
        
        <div>
          <Label className="block mb-2">Company Banner</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Upload a banner image for your profile (recommended size: 1200x300px)
            </p>
            <Button variant="outline" className="mt-4">Select Image</Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="company-tagline" className="block mb-2">Company Tagline</Label>
          <Input id="company-tagline" placeholder="A short, catchy phrase describing your business" />
        </div>
        
        <div>
          <Label htmlFor="social-profiles" className="block mb-2">Social Media Profiles</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <span className="text-lg font-bold">in</span>
              </div>
              <Input placeholder="LinkedIn Profile URL" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                <span className="text-lg font-bold">f</span>
              </div>
              <Input placeholder="Facebook Page URL" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-400">
                <span className="text-lg font-bold">t</span>
              </div>
              <Input placeholder="Twitter Profile URL" />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="usp" className="block mb-2">Key Selling Points</Label>
          <Textarea 
            id="usp" 
            placeholder="What makes your company unique? List your key strengths and competitive advantages." 
            className="resize-none h-32" 
          />
        </div>
      </div>
    </div>
  );
};

interface CompleteStepProps {
  accountType: string;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ accountType }) => {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckIcon className="h-10 w-10 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Congratulations! Your {accountType === 'manufacturer' ? 'manufacturer' : accountType === 'distributor' ? 'distributor' : 'buyer'} profile is now set up and ready to use.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Add Products</h4>
              <p className="text-sm text-gray-500">
                {accountType === 'manufacturer' ? 'Showcase your manufacturing capabilities' : 'Build your product catalog'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Explore Marketplace</h4>
              <p className="text-sm text-gray-500">
                {accountType === 'buyer' ? 'Find products from global suppliers' : 'Discover potential business partners'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-medium mb-2">Schedule Demo</h4>
              <p className="text-sm text-gray-500">
                Book a session with our team to learn platform features
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;