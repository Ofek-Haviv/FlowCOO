import dotenv from 'dotenv';

dotenv.config();

const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME;
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

export const getShopifyClient = async (accessToken) => {
  try {
    console.log('Initializing Shopify client with shop:', SHOPIFY_SHOP_NAME);
    const baseUrl = `https://${SHOPIFY_SHOP_NAME}/admin/api/2024-01`;
    
    return {
      get: async (path) => {
        console.log(`Making GET request to: ${baseUrl}/${path}`);
        const response = await fetch(`${baseUrl}/${path}`, {
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
        });
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!response.ok) {
          console.error('Shopify API error:', {
            status: response.status,
            statusText: response.statusText,
            body: responseText
          });
          throw new Error(`Shopify API error: ${response.statusText} - ${responseText}`);
        }
        
        try {
          const data = JSON.parse(responseText);
          console.log(`Successfully fetched data from ${path}`);
          return data;
        } catch (parseError) {
          console.error('Failed to parse Shopify response:', parseError);
          throw new Error('Invalid response from Shopify API');
        }
      }
    };
  } catch (error) {
    console.error('Error creating Shopify client:', error);
    throw new Error('Failed to connect to Shopify');
  }
};

export const validateShopifyConnection = async (accessToken) => {
  try {
    console.log('Creating Shopify client...');
    const client = await getShopifyClient(accessToken);
    
    console.log('Testing connection with shop.json endpoint...');
    const response = await client.get('shop.json');
    console.log('Shop response:', response);
    
    // Check if we got a valid shop response
    if (!response || !response.shop) {
      console.error('Invalid shop response:', response);
      throw new Error('Invalid shop response from Shopify');
    }
    
    // Log successful validation
    console.log('Successfully validated Shopify connection');
    return true;
  } catch (error) {
    console.error('Shopify connection validation failed:', error);
    // Log the full error details
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      response: error.response
    });
    // Throw a more descriptive error
    throw new Error(`Failed to validate Shopify connection: ${error.message}`);
  }
}; 