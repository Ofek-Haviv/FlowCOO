import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Analytics } from '@/components/Analytics';
import { format } from 'date-fns';

interface FinancialData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: number;
    totalPrice: string;
    createdAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
  }>;
  historicalData: {
    revenue: number[];
    orders: number[];
    customers: number[];
    dates: string[];
  };
}

const Finances = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('shopifyAccessToken'));

  useEffect(() => {
    fetchFinancialData();
  }, [accessToken]);

  const fetchFinancialData = async (startDate?: Date, endDate?: Date) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/shopify/finances`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch financial data');
      const data = await response.json();
      setFinancialData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    fetchFinancialData(startDate, endDate);
  };

  const handleDisconnect = () => {
    localStorage.removeItem('shopifyAccessToken');
    setAccessToken(null);
    setFinancialData(null);
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Shopify",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Finances</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Finances</h1>
        <Card>
          <CardHeader>
            <CardTitle>Connect to Shopify</CardTitle>
            <CardDescription>Enter your Shopify access token to view financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Enter your Shopify access token"
                  value={accessToken || ''}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  if (accessToken) {
                    localStorage.setItem('shopifyAccessToken', accessToken);
                    fetchFinancialData();
                  }
                }}
              >
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finances</h1>
          <p className="text-muted-foreground">Track your business finances</p>
        </div>
        <Button variant="outline" onClick={handleDisconnect}>
          Disconnect Store
        </Button>
      </div>

      {financialData && (
        <>
          <Analytics
            data={financialData.historicalData}
            onDateRangeChange={handleDateRangeChange}
          />

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.monthlyRevenue.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>${item.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.orderNumber}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.financialStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.financialStatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Finances;
