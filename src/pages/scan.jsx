import React from "react";
import QRCodeScanner from "../components/qrscanner";

const ScanPage = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">QR Code Scanner</h1>
      <QRCodeScanner />
    </div>
  );
};

export default ScanPage;
