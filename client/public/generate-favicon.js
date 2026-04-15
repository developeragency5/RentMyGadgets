const sharp = require('sharp');
const fs = require('fs');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#F97316"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">RMG</text>
</svg>`;

async function generateFavicons() {
  const svgBuffer = Buffer.from(svgContent);
  
  // Generate 32x32 PNG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('favicon-32x32.png');
  
  // Generate 16x16 PNG  
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('favicon-16x16.png');
    
  // Generate 180x180 for Apple
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('apple-touch-icon.png');
    
  console.log('Favicons generated successfully!');
}

generateFavicons();
