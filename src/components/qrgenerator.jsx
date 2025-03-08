import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = ({ value }) => {
  return (
    <div className="flex flex-col items-center">
      <QRCodeCanvas
        value={value} // RFID value is embedded in the QR code
        size={200}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
    </div>
  );
};

export default QRCodeGenerator;
