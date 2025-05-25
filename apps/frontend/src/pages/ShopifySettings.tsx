import React, { useState, useEffect } from 'react';
import { useShopify } from '../contexts/ShopifyContext';
import { useToast } from '../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ShopifySettings = () => {
  const [accessToken, setAccessToken] = useState('');
  const { isConnected, shopInfo, error, validateConnection, fetchShopInfo } = useShopify();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected) {
      fetchShopInfo();
    }
  }, [isConnected, fetchShopInfo]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await validateConnection(accessToken);
    if (success) {
      toast({
        title: 'Success',
        description: 'Successfully connected to Shopify',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Shopify Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Connect Your Shopify Store</CardTitle>
          <CardDescription>
            Enter your Shopify access token to connect your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter your Shopify access token"
              />
            </div>
            <Button type="submit" disabled={!accessToken}>
              Connect Store
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isConnected && shopInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Store</CardTitle>
            <CardDescription>
              Your Shopify store is successfully connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Store Name: {shopInfo.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Domain: {shopInfo.domain}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Email: {shopInfo.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShopifySettings; 