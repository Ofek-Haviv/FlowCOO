
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ShoppingCart, RefreshCcw, DownloadCloud } from "lucide-react";
import { useShopify } from "@/hooks/useShopify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#1A1F2C", "#D6BCFA"];

const ShopifyDashboard = () => {
  const {
    isConnected,
    isLoading,
    isImporting,
    lastImported,
    salesData,
    productData,
    connectShopify,
    importData
  } = useShopify();
  const [shopUrl, setShopUrl] = useState("");
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  const handleConnectShopify = () => {
    connectShopify(shopUrl);
    setShowConnectDialog(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-10">
          <p>Loading Shopify integration...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopify Integration
          </CardTitle>
          <CardDescription>Connect your Shopify store to view sales data</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <ShoppingCart className="h-16 w-16 mb-4 text-muted-foreground" />
          <p className="text-center text-muted-foreground mb-4">
            Connect your Shopify store to see real-time sales data, inventory levels, and customer insights.
          </p>
          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogTrigger asChild>
              <Button>Connect Shopify</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to Shopify</DialogTitle>
                <DialogDescription>
                  Enter your Shopify store URL to connect your store.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="shopUrl">Store URL</Label>
                  <Input
                    id="shopUrl"
                    placeholder="your-store.myshopify.com"
                    value={shopUrl}
                    onChange={(e) => setShopUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConnectDialog(false)}>Cancel</Button>
                <Button onClick={handleConnectShopify}>Connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopify Sales
            </CardTitle>
            <CardDescription>Overview of your store performance</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {lastImported && (
              <span className="text-xs text-muted-foreground">
                Last updated: {lastImported.toLocaleString()}
              </span>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={importData}
              disabled={isImporting}
              className="flex items-center gap-1"
            >
              {isImporting ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="h-4 w-4" />
                  <span>Import Data</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₪${value}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₪${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopifyDashboard;
