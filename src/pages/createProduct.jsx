"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import QRCodeGenerator from "@/components/qrgenerator"; // Import QRCodeGenerator

const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [codeProduct, setCodeProduct] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [barcodeSymbology, setBarcodeSymbology] = useState("");
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUnit, setProductUnit] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [quantity, setQuantity] = useState(""); // Separate state for quantity
    const [productImage, setProductImage] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const productData = {
        name: productName,
        code: codeProduct,
        category: category.toUpperCase() || "NON_PERISHABLE",
        type: brand.toUpperCase() || "ELECTRONICS",
        price: parseFloat(productPrice) || 0,
        unit: productUnit || "units",
        warehouseId: "67cc0e7d99576dcf159f91c8",
        quantity: quantity || "0",
      };
    
      try {
        const response = await fetch("http://localhost:5000/api/warehouseProducts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
    
        const data = await response.json();
        if (response.ok) {
          alert("Product created successfully!");
          console.log("Response:", data);
        } else {
          alert(`Error: ${data.message || "Failed to create product"}`);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to create product. Please try again.");
      }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
    };

  const generateRFID = () => {
    const hexCharacters = "0123456789ABCDEF";
    let rfidCode = "";
    for (let i = 0; i < 16; i++) { // Generate a 16-character RFID code
      rfidCode += hexCharacters.charAt(Math.floor(Math.random() * hexCharacters.length));
    }
    setCodeProduct(rfidCode);
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Products</CardTitle>
          <CardDescription>Dashboard / Create Products</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Name */}
            <div>
              <Label htmlFor="productName" style={{marginBottom:'5px'}}>Product Name</Label>
              <Input
                type="text"
                id="productName"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* Generate RFID */}
            <div>
              <Label style={{marginBottom:'5px'}}>RFID Code</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  id="codeProduct"
                  placeholder="RFID Code"
                  value={codeProduct}
                  readOnly
                />
                <Button onClick={generateRFID}>Generate RFID</Button>
              </div>
            </div>

              {/* Image Upload */}
              <div>
                  <Label htmlFor="productImage" style={{ marginBottom: '5px' }}>Product Image</Label>
                  <Input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      onChange={handleImageChange}
                  />
                  {productImage && (
                      <div>
                          <p>Selected Image: {productImage.name}</p>
                          {/* You can add an image preview here if needed */}
                      </div>
                  )}
              </div>

            {/* Category */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERISHABLE">PERISHABLE</SelectItem>
                  <SelectItem value="NON_PERISHABLE">NON_PERISHABLE</SelectItem>
                  
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="brand">Brand</Label>
              <Select onValueChange={(value) => setBrand(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRONICS">ELECTRONICS</SelectItem>
                  <SelectItem value="FOOD">FOOD</SelectItem>
                  <SelectItem value="FURNITURE">  FURNITURE </SelectItem>
                  <SelectItem value="MEDICINE">MEDICINE</SelectItem>
                  <SelectItem value="BEAUTY">BEAUTY</SelectItem>
                  <SelectItem value="TOOLS">TOOLS</SelectItem>
                  <SelectItem value="TOYS">TOYS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Cost */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="productCost">Product Cost</Label>
              <Input
                type="number"
                id="productCost"
                placeholder="Enter Product Cost"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
              />
            </div>

            {/* Product Price */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="productPrice">Product Price</Label>
              <Input
                type="number"
                id="productPrice"
                placeholder="Enter Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Product Unit */}
            <div>
              <Label style={{marginBottom:'5px'}} htmlFor="productUnit">Product Unit</Label>
              <Select onValueChange={(value) => setProductUnit(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Product unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* QR Code Generation */}
            <div className="col-span-full">
              <h2 className="text-lg font-bold mb-2">Generated QR Code for the product</h2>
              {codeProduct && (
                <QRCodeGenerator value={codeProduct} />
              )}
            </div>
          </div>

          {/* Has Multi Variants */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasVariants"
              checked={hasVariants}
              onCheckedChange={(checked) => setHasVariants(checked)}
            />
         
          </div>

          <Button onClick={handleSubmit}>Create Product</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
