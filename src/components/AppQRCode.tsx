import React from "react";
import QRCode from "qrcode.react";

interface AppQRCodeProps {
  url: string;
}

const AppQRCode = ({ url }: AppQRCodeProps) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Scan for better experince</h2>
      <QRCode value={url} size={200} />
    </div>
  );
};

export default AppQRCode;
