import React from "react";
import QRCode from "qrcode.react";

interface AppQRCodeProps {
  url: string;
}

const AppQRCode: React.FC<AppQRCodeProps> = ({ url }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Download Our App</h2>
      <QRCode value={url} size={256} />
    </div>
  );
};

export default AppQRCode;
