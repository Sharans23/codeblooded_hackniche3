import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const QRCodeScanner = () => {
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchedProduct, setMatchedProduct] = useState(null);

  // Fetch all products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:5000/api/warehouseProducts/67cc52504bf2e035730c0d48`, {
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data)
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products from server");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Find matching product when RFID changes
  useEffect(() => {
    if (rfid && products.length > 0) {
      const product = products.find(p => p.product.code === rfid);
      setMatchedProduct(product || null);
      
      if (!product) {
        setError(`No product found with RFID: ${rfid}`);
      } else {
        setError(null);
      }
    }
  }, [rfid, products]);

  const resetScanner = () => {
    setRfid("");
    setMatchedProduct(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Product Scanner</h1>
      
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {!matchedProduct && (
            <div className="w-full max-w-md mb-6">
              <Scanner
                onScan={(result) => {
                  console.log("Decoded RFID:", result);
                  // Extract the rawValue from the result
                  if (result && result[0] && result[0].rawValue) {
                    setRfid(result[0].rawValue);
                  } else if (result && result.rawValue) {
                    setRfid(result.rawValue);
                  } else {
                    console.error("Unexpected result format:", result);
                  }
                  setError(null);
                }}
                onError={(error) => {
                  console.error("QR Scan Error:", error);
                  setError(error?.message);
                }}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4 w-full max-w-md">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {matchedProduct && (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{matchedProduct.product.name}</CardTitle>
                <CardDescription>RFID: {matchedProduct.product.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedProduct.imageUrl && (
                    <img 
                      src={matchedProduct.imageUrl} 
                      alt={matchedProduct.name}
                      className="w-full h-48 object-contain rounded-md"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/320";
                        e.target.alt = "Product image unavailable";
                      }}
                    />
                  )}
                  <p className="text-sm">{matchedProduct.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Price</p>
                      <p className="text-lg">${matchedProduct.product.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stock</p>
                      <p className="text-lg">{matchedProduct.product.stock} units</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={resetScanner} className="w-full">Scan Another Product</Button>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;