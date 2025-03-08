import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          onScan(result.getText()); // Pass scanned data to parent
        }
        if (err) {
          setError("Scanning...");
        }
      })
      .catch((err) => setError("Camera access denied"));

    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default QRScanner;
