import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRCodeScanner = () => {
  const [rfid, setRfid] = useState("");
  const [error, setError] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center h-99">
      <h1 className="text-xl font-bold mb-4">Scan QR Code</h1>
      <Scanner
        onScan={(result) => {
          console.log("Decoded RFID:", result);
          setRfid(result.data); // Extracted RFID value
          setError(null); // Clear any previous error
        }}
        onError={(error) => {
          console.error("QR Scan Error:", error);
          setError(error?.message); // Display error message
        }}
      />
      {rfid && <p className="mt-4 text-lg font-semibold">RFID: {rfid}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default QRCodeScanner;
