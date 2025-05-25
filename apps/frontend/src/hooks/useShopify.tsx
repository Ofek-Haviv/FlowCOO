
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Updated import path
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ShopifyStore {
  id: string;
  shopUrl: string;
  connectedAt: string;
}

export interface SalesData {
  name: string;
  sales: number;
}

export interface ProductData {
  name: string;
  value: number;
}

export const useShopify = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [shopifyStore, setShopifyStore] = useState<ShopifyStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [lastImported, setLastImported] = useState<Date | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) {
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has a Shopify connection
        const { data, error } = await supabase
          .from('shopify_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No records found
            setIsConnected(false);
          } else {
            console.error('Error checking Shopify connection:', error);
            toast({
              title: "Error",
              description: "Could not check Shopify connection status.",
              variant: "destructive"
            });
          }
        } else if (data) {
          setIsConnected(true);
          setShopifyStore({
            id: data.id,
            shopUrl: data.shop_url,
            connectedAt: data.created_at
          });
          
          if (data.last_sync) {
            setLastImported(new Date(data.last_sync));
          }
          
          // Fetch sales and product data
          await Promise.all([
            fetchSalesData(),
            fetchProductData()
          ]);
        }
      } catch (error) {
        console.error('Error checking Shopify connection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [user, toast]);

  const fetchSalesData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shopify_sales')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data.map(item => ({
        name: item.month,
        sales: item.sales
      }));

      setSalesData(formattedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchProductData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shopify_products')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data.map(item => ({
        name: item.name,
        value: item.value
      }));

      setProductData(formattedData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  // This would call a serverless function to handle the OAuth flow
  const connectShopify = async (shopUrl: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect Shopify.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real implementation, we would redirect to a serverless function
      // that handles the Shopify OAuth flow. For this demo, we'll just mock it.
      toast({
        title: "Connecting to Shopify",
        description: "Processing your request..."
      });
      
      // Simulate a connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Insert mock Shopify connection data
      const { data, error } = await supabase
        .from('shopify_data')
        .insert({
          user_id: user.id,
          shop_url: shopUrl,
          access_token: 'mock_token_' + Math.random().toString(36).substring(2),
          last_sync: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      
      // Add sample data for the demo
      await addSampleShopifyData(user.id);

      setIsConnected(true);
      setShopifyStore({
        id: data.id,
        shopUrl: data.shop_url,
        connectedAt: data.created_at
      });
      
      if (data.last_sync) {
        setLastImported(new Date(data.last_sync));
      }

      toast({
        title: "Shopify Connected",
        description: `Successfully connected to ${shopUrl}`
      });

      // Refresh data
      await Promise.all([
        fetchSalesData(),
        fetchProductData()
      ]);
      
    } catch (error) {
      console.error('Error connecting to Shopify:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to Shopify. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const addSampleShopifyData = async (userId: string) => {
    try {
      // Add sample sales data
      const salesData = [
        { user_id: userId, month: "Jan", sales: 4200 },
        { user_id: userId, month: "Feb", sales: 3800 },
        { user_id: userId, month: "Mar", sales: 5100 },
        { user_id: userId, month: "Apr", sales: 6200 },
        { user_id: userId, month: "May", sales: 7500 },
        { user_id: userId, month: "Jun", sales: 8900 }
      ];
      
      await supabase.from('shopify_sales').insert(salesData);
      
      // Add sample product data
      const productData = [
        { user_id: userId, name: "Dresses", value: 8400 },
        { user_id: userId, name: "Tops", value: 6700 },
        { user_id: userId, name: "Pants", value: 5400 },
        { user_id: userId, name: "Accessories", value: 4100 }
      ];
      
      await supabase.from('shopify_products').insert(productData);
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  };

  const importData = async () => {
    if (!user || !isConnected) return;
    
    try {
      setIsImporting(true);
      
      // In a real implementation, this would call a serverless function
      // that fetches data from the Shopify API. For this demo, we'll just wait.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last imported time
      const now = new Date();
      await supabase
        .from('shopify_data')
        .update({ last_sync: now.toISOString() })
        .eq('user_id', user.id);
      
      setLastImported(now);
      
      // Refresh data
      await Promise.all([
        fetchSalesData(),
        fetchProductData()
      ]);
      
      toast({
        title: "Data imported successfully",
        description: "Your Shopify data has been updated."
      });
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Import Error",
        description: "Could not import data from Shopify. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isConnected,
    shopifyStore,
    isLoading,
    isImporting,
    lastImported,
    salesData,
    productData,
    connectShopify,
    importData
  };
};
