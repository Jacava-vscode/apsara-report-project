const QRCode = require('qrcode');

async function generateQRCodeForCustomer(customerId) {
  // The QR code can encode a URL or an identifier. For now we encode a URL path.
  const data = `apsara://customer/${customerId}`;
  try {
    const dataUrl = await QRCode.toDataURL(data, { margin: 2 });
    return dataUrl;
  } catch (err) {
    console.error('QR generation error', err);
    return null;
  }
}

module.exports = { generateQRCodeForCustomer };
