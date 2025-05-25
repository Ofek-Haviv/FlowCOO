import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface ShopifyContextType {
  isConnected: boolean;
  shopInfo: any;
  products: any[];
  validateConnection: (accessToken: string) => Promise<boolean>;
  fetchShopInfo: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  error: string | null;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export const ShopifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const validateConnection = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shopify/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate Shopify connection');
      }

      setIsConnected(true);
      setError(null);
      return true;
    } catch (error) {
      console.error('Shopify validation error:', error);
      setError('Failed to connect to Shopify. Please try again.');
      setIsConnected(false);
      return false;
    }
  }, []);

  const fetchShopInfo = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shopify/shop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shop information');
      }

      const data = await response.json();
      setShopInfo(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching shop info:', error);
      setError('Failed to fetch shop information');
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shopify/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  }, [token]);

  return (
    <ShopifyContext.Provider
      value={{
        isConnected,
        shopInfo,
        products,
        validateConnection,
        fetchShopInfo,
        fetchProducts,
        error,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
}; 