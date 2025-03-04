import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back, TechFabrics Ltd</h1>
          <p className="text-gray-500">Manufacturer Dashboard</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button>Add New Product</Button>
          <Button variant="outline">View Inquiries</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardMetricCard
          title="Current Inquiries"
          value="12"
          change="+3"
          trend="up"
        />
        <DashboardMetricCard
          title="Active Orders"
          value="8"
          change="+2"
          trend="up"
        />
        <DashboardMetricCard
          title="Revenue (This Month)"
          value="$45,250"
          change="+15%"
          trend="up"
        />
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      type: 'New Inquiry', 
                      title: 'ABC Corp requested a quote for Industrial Textile Machine', 
                      time: '2 hours ago' 
                    },
                    { 
                      type: 'Order Status', 
                      title: 'Order #ORD-2023-428 has been shipped', 
                      time: '5 hours ago' 
                    },
                    { 
                      type: 'New Message', 
                      title: 'You have a new message from XYZ Global Trading', 
                      time: '1 day ago' 
                    },
                    { 
                      type: 'Payment', 
                      title: 'Payment received for Order #ORD-2023-421', 
                      time: '2 days ago' 
                    },
                    { 
                      type: 'System', 
                      title: 'Your product catalog has been updated', 
                      time: '3 days ago' 
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {activity.type}
                          </span>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm mt-1">{activity.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { 
                      name: 'Industrial Textile Machine', 
                      inquiries: 48, 
                      conversion: 42 
                    },
                    { 
                      name: 'High-Speed Loom Model A259', 
                      inquiries: 36, 
                      conversion: 38 
                    },
                    { 
                      name: 'Automated Cutting Machine', 
                      inquiries: 29, 
                      conversion: 52 
                    },
                    { 
                      name: 'Textile Dyeing Equipment', 
                      inquiries: 24, 
                      conversion: 29 
                    }
                  ].map((product, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-sm text-gray-500">{product.conversion}% Conversion</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={product.conversion} className="h-2" />
                        </div>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {product.inquiries} Inquiries
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buyer Geography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: 'United States', percentage: 35 },
                    { country: 'Germany', percentage: 18 },
                    { country: 'United Arab Emirates', percentage: 15 },
                    { country: 'United Kingdom', percentage: 12 },
                    { country: 'Japan', percentage: 8 },
                    { country: 'Australia', percentage: 7 },
                    { country: 'Others', percentage: 5 }
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-5 bg-gray-200 rounded mr-3"></div>
                        <span className="text-sm">{entry.country}</span>
                      </div>
                      <span className="text-sm font-medium">{entry.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      task: 'Respond to new inquiries (3)', 
                      deadline: 'Today', 
                      priority: 'high' 
                    },
                    { 
                      task: 'Upload shipping documents for order #ORD-2023-425', 
                      deadline: 'Tomorrow', 
                      priority: 'medium' 
                    },
                    { 
                      task: 'Update product specifications for 2 products', 
                      deadline: 'May 28', 
                      priority: 'medium' 
                    },
                    { 
                      task: 'Renew ISO certification', 
                      deadline: 'June 15', 
                      priority: 'high' 
                    },
                    { 
                      task: 'Quarterly inventory audit', 
                      deadline: 'June 30', 
                      priority: 'low' 
                    }
                  ].map((task, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{task.task}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.deadline === 'Today' ? 'bg-red-50 text-red-600' :
                            task.deadline === 'Tomorrow' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {task.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Tasks</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Buyer</th>
                    <th className="text-left py-3 px-2">Products</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      id: 'INQ-2023-042', 
                      buyer: 'ABC Corp, USA', 
                      products: 'Industrial Textile Machine',
                      date: 'May 25, 2023',
                      status: 'pending'
                    },
                    { 
                      id: 'INQ-2023-041', 
                      buyer: 'Global Textiles UK', 
                      products: 'High-Speed Loom x2',
                      date: 'May 24, 2023',
                      status: 'responded'
                    },
                    { 
                      id: 'INQ-2023-040', 
                      buyer: 'Dubai Fabrics LLC', 
                      products: 'Textile Dyeing Equipment, Automated Cutting Machine',
                      date: 'May 23, 2023',
                      status: 'negotiating'
                    },
                    { 
                      id: 'INQ-2023-039', 
                      buyer: 'Fashion First GmbH', 
                      products: 'Industrial Textile Machine',
                      date: 'May 22, 2023',
                      status: 'confirmed'
                    },
                    { 
                      id: 'INQ-2023-038', 
                      buyer: 'Textil Experts SA', 
                      products: 'Automated Cutting Machine',
                      date: 'May 21, 2023',
                      status: 'cancelled'
                    }
                  ].map((inquiry, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2">{inquiry.id}</td>
                      <td className="py-3 px-2">{inquiry.buyer}</td>
                      <td className="py-3 px-2">{inquiry.products}</td>
                      <td className="py-3 px-2">{inquiry.date}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          inquiry.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                          inquiry.status === 'negotiating' ? 'bg-purple-100 text-purple-800' :
                          inquiry.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button variant="outline" className="mt-4">View All Inquiries</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Buyer</th>
                    <th className="text-left py-3 px-2">Amount</th>
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Fulfillment</th>
                    <th className="text-right py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      id: 'ORD-2023-428', 
                      buyer: 'ABC Corp, USA', 
                      amount: '$15,780',
                      date: 'May 23, 2023',
                      status: 'shipped'
                    },
                    { 
                      id: 'ORD-2023-427', 
                      buyer: 'Fashion First GmbH', 
                      amount: '$28,450',
                      date: 'May 21, 2023',
                      status: 'processing'
                    },
                    { 
                      id: 'ORD-2023-426', 
                      buyer: 'Dubai Fabrics LLC', 
                      amount: '$42,300',
                      date: 'May 18, 2023',
                      status: 'pending'
                    },
                    { 
                      id: 'ORD-2023-425', 
                      buyer: 'Global Textiles UK', 
                      amount: '$18,920',
                      date: 'May 15, 2023',
                      status: 'shipped'
                    },
                    { 
                      id: 'ORD-2023-424', 
                      buyer: 'Tokyo Cloth Co.', 
                      amount: '$31,750',
                      date: 'May 12, 2023',
                      status: 'delivered'
                    }
                  ].map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2">{order.id}</td>
                      <td className="py-3 px-2">{order.buyer}</td>
                      <td className="py-3 px-2">{order.amount}</td>
                      <td className="py-3 px-2">{order.date}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button variant="outline" className="mt-4">View All Orders</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    sender: 'ABC Corp, USA', 
                    message: 'Thank you for your prompt response. Could you please provide more details about the shipping options for our order?',
                    time: '2 hours ago',
                    unread: true
                  },
                  { 
                    sender: 'Global Textiles UK', 
                    message: 'We are interested in placing a bulk order for high-speed looms. Can you share your best pricing for an order of 10 units?',
                    time: '1 day ago',
                    unread: true
                  },
                  { 
                    sender: 'Dubai Fabrics LLC', 
                    message: 'The shipment has been received. All items are in excellent condition. We look forward to doing more business with you.',
                    time: '2 days ago',
                    unread: false
                  },
                  { 
                    sender: 'Fashion First GmbH', 
                    message: 'We need to discuss some customization options for our upcoming order. When would be a good time for a call?',
                    time: '3 days ago',
                    unread: false
                  }
                ].map((message, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${message.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">{message.sender}</span>
                        {message.unread && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-xs">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Messages</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DashboardMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
          </div>
          <div className={`text-sm px-2 py-1 rounded-full flex items-center ${
            trend === 'up' ? 'bg-green-100 text-green-800' :
            trend === 'down' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trend === 'up' && <span className="mr-1">↑</span>}
            {trend === 'down' && <span className="mr-1">↓</span>}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;