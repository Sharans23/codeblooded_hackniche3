import QRCodeGenerator from "@/components/qrgenerator";
import React from "react";
// import QRCodeGenerator from "../../components/QRCodeGenerator";

const GeneratePage = () => {
  const RFID = "RFID-123456789"; // Example RFID

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <QRCodeGenerator value={RFID} />
    </div>
  );
};

export default GeneratePage;
