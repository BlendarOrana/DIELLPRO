import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Upload, Palette, Link, ArrowLeft, RefreshCw, FileImage, Code } from 'lucide-react';
import QRCode from 'qrcode';

// Custom finder pattern component with customizable colors
const FinderPattern = ({ size, centerX, centerY, primaryColor, secondaryColor }) => {
  const patternSize = size * 7;

  return (
    <div
      style={{
        position: 'absolute',
        left: centerX - patternSize / 2,
        top: centerY - patternSize / 2,
        width: patternSize,
        height: patternSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: patternSize,
          height: patternSize,
          border: `${patternSize * 0.14}px solid ${primaryColor}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: patternSize * 0.4,
            height: patternSize * 0.4,
            backgroundColor: secondaryColor,
            borderRadius: '25%',
          }}
        />
      </div>
    </div>
  );
};

// Function to interpolate between two colors
const interpolateColor = (color1, color2, factor) => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Function to check if a module is part of a standard finder pattern area
const isFinderPattern = (x, y, size) => {
  if (x <= 7 && y <= 7) return true;
  if (x >= size - 8 && y <= 7) return true;
  if (x <= 7 && y >= size - 8) return true;
  return false;
};

// Function to check if a module is in the central logo area
const isCenterArea = (x, y, size) => {
  const center = (size - 1) / 2;
  const centerRadius = size * 0.12;
  const distance = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
  return distance < centerRadius;
};

// Customizable QR Code component
const CustomQRCode = ({ 
  text, 
  qrSize = 600, 
  primaryColor = '#22c55e', 
  secondaryColor = '#fbbf24',
  backgroundColor = '#000000',
  logoUrl = null,
  logoSize = 180,
  style = 'diamonds' // 'diamonds', 'squares', 'circles'
}) => {
  const [qrMatrix, setQrMatrix] = useState(null);
  
  useEffect(() => {
    const generateQR = async () => {
      if (!text) return;
      try {
        const qrCode = await QRCode.create(text, { 
          errorCorrectionLevel: 'H',
          type: 'terminal',
          quality: 0.92,
          margin: 4,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        const size = qrCode.modules.size;
        const matrix = [];
        for (let i = 0; i < size; i++) {
          matrix[i] = [];
          for (let j = 0; j < size; j++) {
            matrix[i][j] = qrCode.modules.data[i * size + j];
          }
        }
        setQrMatrix(matrix);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [text]);
  
  if (!qrMatrix) {
    return (
      <div style={{ 
        width: qrSize, 
        height: qrSize, 
        backgroundColor: backgroundColor, 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        Enter URL or text to generate QR Code
      </div>
    );
  }
  
  const matrixSize = qrMatrix.length;
  const moduleSize = qrSize / matrixSize;
  const center = (matrixSize - 1) / 2;
  const maxDistance = Math.sqrt(2 * Math.pow(center, 2));
  
  const getModuleStyle = (x, y) => {
    const distance = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
    const normalizedDistance = Math.min(distance / (maxDistance * 0.75), 1);
    const color = interpolateColor(primaryColor, secondaryColor, normalizedDistance);
    
    const shouldAddSpacing = (x + y) % 7 === 0 || (x * y) % 11 === 0;
    const spacing = shouldAddSpacing ? moduleSize * 0.15 : moduleSize * 0.05;
    const moduleStyleSize = moduleSize * 0.65;
    
    const baseStyle = {
      position: 'absolute',
      left: x * moduleSize + spacing,
      top: y * moduleSize + spacing,
      width: moduleStyleSize,
      height: moduleStyleSize,
      backgroundColor: color,
    };
    
    switch (style) {
      case 'circles':
        return { ...baseStyle, borderRadius: '50%' };
      case 'squares':
        return { ...baseStyle, borderRadius: '0%' };
      case 'diamonds':
      default:
        return { 
          ...baseStyle, 
          transform: 'rotate(45deg)', 
          borderRadius: '10%' 
        };
    }
  };
  
  return (
    <div style={{ width: qrSize, height: qrSize, position: 'relative', background: backgroundColor }}>
      {qrMatrix.map((row, y) => 
        row.map((module, x) => {
          if (!module || isFinderPattern(x, y, matrixSize) || isCenterArea(x, y, matrixSize)) {
            return null;
          }
          
          return (
            <div
              key={`${y}-${x}`}
              style={getModuleStyle(x, y)}
            />
          );
        })
      )}
      
      {/* Custom finder patterns */}
      <FinderPattern 
        size={moduleSize} 
        centerX={3.5 * moduleSize} 
        centerY={3.5 * moduleSize}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      <FinderPattern 
        size={moduleSize} 
        centerX={(matrixSize - 3.5) * moduleSize} 
        centerY={3.5 * moduleSize}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      <FinderPattern 
        size={moduleSize} 
        centerX={3.5 * moduleSize} 
        centerY={(matrixSize - 3.5) * moduleSize}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      
      {/* Logo overlay */}
      {logoUrl && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '8px',
        }}>
          <img 
            src={logoUrl} 
            alt="Logo" 
            style={{ 
              width: logoSize, 
              height: logoSize, 
              objectFit: 'contain',
              borderRadius: '6px'
            }} 
          />
        </div>
      )}
    </div>
  );
};

// QR Code tile for export
const QRCodeTile = React.forwardRef(({ qrText, primaryColor, secondaryColor, backgroundColor, logoUrl, logoSize, style }, ref) => {
  return (
    <div 
      ref={ref} 
      style={{
        width: '800px',
        height: '800px',
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <CustomQRCode 
        text={qrText} 
        qrSize={700}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        backgroundColor={backgroundColor}
        logoUrl={logoUrl}
        logoSize={logoSize}
        style={style}
      />
    </div>
  );
});
QRCodeTile.displayName = 'QRCodeTile';

// Color preset options
const colorPresets = [
  { name: 'Blue & Cyan', primary: '#3b82f6', secondary: '#06b6d4' },
  { name: 'Purple & Pink', primary: '#8b5cf6', secondary: '#ec4899' },
  { name: 'Red & Orange', primary: '#ef4444', secondary: '#f97316' },
  { name: 'Emerald & Teal', primary: '#10b981', secondary: '#14b8a6' },
  { name: 'Indigo & Blue', primary: '#6366f1', secondary: '#3b82f6' },
];

// Main QR Generator component
const QRCodeGenerator = ({ onBack }) => {
  const tileRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [qrText, setQrText] = useState('https://www.diell.pro');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#fbbf24');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoSize, setLogoSize] = useState(180);
  const [style, setStyle] = useState('diamonds');

  const exportPNG = async () => {
    if (!tileRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(tileRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: backgroundColor
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `custom-qr-code-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      alert('PNG export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportSVG = async () => {
    if (!qrText) return;
    setIsExporting(true);

    try {
      // Generate QR code data
      const qrCode = await QRCode.create(qrText, { 
        errorCorrectionLevel: 'H',
        type: 'terminal',
        quality: 0.92,
        margin: 4
      });
      
      const size = qrCode.modules.size;
      const moduleSize = 800 / size;
      
      // Create SVG
      let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <rect width="800" height="800" fill="${backgroundColor}"/>`;
      
      // Add QR modules
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (qrCode.modules.data[y * size + x]) {
            const centerX = (size - 1) / 2;
            const centerY = (size - 1) / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDistance = Math.sqrt(2 * Math.pow(centerX, 2));
            const normalizedDistance = Math.min(distance / (maxDistance * 0.75), 1);
            const color = interpolateColor(primaryColor, secondaryColor, normalizedDistance);
            
            const moduleX = x * moduleSize + moduleSize * 0.1;
            const moduleY = y * moduleSize + moduleSize * 0.1;
            const moduleWidth = moduleSize * 0.8;
            
            if (style === 'circles') {
              svgContent += `<circle cx="${moduleX + moduleWidth/2}" cy="${moduleY + moduleWidth/2}" r="${moduleWidth/2}" fill="${color}"/>`;
            } else if (style === 'squares') {
              svgContent += `<rect x="${moduleX}" y="${moduleY}" width="${moduleWidth}" height="${moduleWidth}" fill="${color}"/>`;
            } else {
              // diamonds
              svgContent += `<rect x="${moduleX}" y="${moduleY}" width="${moduleWidth}" height="${moduleWidth}" fill="${color}" transform="rotate(45 ${moduleX + moduleWidth/2} ${moduleY + moduleWidth/2})"/>`;
            }
          }
        }
      }
      
      svgContent += `</svg>`;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom-qr-code-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export SVG:', error);
      alert('SVG export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const applyColorPreset = (preset) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg text-neutral-300 hover:text-white hover:border-neutral-600 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            QR Code Generator
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
            Create beautiful, branded QR codes with custom colors, logos, and styles.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Preview Panel - Mobile First */}
          <div className="flex flex-col items-center order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Preview</h3>
            <div className="relative transform-gpu">
              {/* 3D Shadow layers */}
              <div className="absolute inset-0 bg-neutral-700 rounded-xl transform translate-x-1 translate-y-1 sm:translate-x-2 sm:translate-y-2 blur-sm opacity-30"></div>
              <div className="absolute inset-0 bg-neutral-600 rounded-xl transform translate-x-0.5 translate-y-0.5 sm:translate-x-1 sm:translate-y-1 opacity-20"></div>
              
              {/* Main preview container with 3D effect */}
              <div 
                className="relative border-2 sm:border-4 border-neutral-700 rounded-xl bg-neutral-800 overflow-hidden transform-gpu transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  width: '280px',
                  height: '280px',
                  boxShadow: `
                    0 10px 25px rgba(0, 0, 0, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.05)
                  `
                }}
              >
                <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left' }}>
                  <QRCodeTile 
                    qrText={qrText}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    backgroundColor={backgroundColor}
                    logoUrl={logoUrl}
                    logoSize={logoSize}
                    style={style}
                    ref={tileRef}
                  />
                </div>
              </div>
            </div>
            
            {/* Tips */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg w-full max-w-md">
              <ul className="text-xs sm:text-sm text-neutral-400 space-y-1">
                <li>• Keep logos small to maintain functionality</li>
                <li>• Test your QR code with different scanners</li>
                <li>• Higher contrast colors work better</li>
              </ul>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* URL Input */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4 sm:p-6">
              <label className="flex items-center gap-2 text-lg font-semibold mb-3 sm:mb-4">
                <Link size={18} sm:size={20} />
                URL or Text
              </label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:border-green-500 focus:outline-none transition-all text-sm sm:text-base"
                placeholder="Enter URL or text"
              />
            </div>

            {/* Color Controls */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4 sm:p-6">
              <label className="flex items-center gap-2 text-lg font-semibold mb-3 sm:mb-4">
                <Palette size={18} sm:size={20} />
                Colors
              </label>
              
              {/* Color Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyColorPreset(preset)}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-all duration-200"
                  >
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded" 
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded" 
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Custom Colors */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Primary</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-8 sm:h-10 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Secondary</label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-8 sm:h-10 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Background</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-8 sm:h-10 bg-neutral-800 border border-neutral-700 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Style Options */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Style</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {['diamonds', 'circles', 'squares'].map((styleOption) => (
                  <button
                    key={styleOption}
                    onClick={() => setStyle(styleOption)}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all capitalize text-xs sm:text-sm ${
                      style === styleOption 
                        ? 'border-green-500 bg-green-500/20' 
                        : 'border-neutral-700 bg-neutral-800'
                    }`}
                  >
                    {styleOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-4 sm:p-6">
              <label className="flex items-center gap-2 text-lg font-semibold mb-3 sm:mb-4">
                <Upload size={18} sm:size={20} />
                Logo (Optional)
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-2 sm:p-3 border-2 border-dashed border-neutral-700 rounded-lg hover:border-neutral-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Upload size={16} sm:size={20} />
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
              </button>
              
              {logoUrl && (
                <div className="mt-3 sm:mt-4">
                  <label className="block text-xs sm:text-sm text-neutral-400 mb-2">Logo Size</label>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs sm:text-sm text-neutral-400 text-center">{logoSize}px</div>
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={exportPNG}
                disabled={isExporting || !qrText}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[#fbbf24] disabled:bg-neutral-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <FileImage size={16} sm:size={20} />
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </button>
              <button
                onClick={exportSVG}
                disabled={isExporting || !qrText}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 disabled:bg-neutral-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <Code size={16} sm:size={20} />
                Export SVG
              </button>
            </div>
          </div>
        </div>
        
        {/* === START: ADDED SECTION === */}
        {/* Acknowledgement Footer */}
        <div className="text-center mt-16 pb-4">
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            This tool was able to be pulled off easily and saved us a ton of time thanks to these amazing open-source libraries and their publishers:
          </p>
          <div className="flex justify-center items-center gap-x-4 mt-3">
            <a 
              href="https://github.com/bubkoo/html-to-image" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-neutral-400 hover:text-green-400 transition-colors"
            >
              html-to-image
            </a>
            <span className="text-neutral-600">&</span>
            <a 
              href="https://github.com/soldair/node-qrcode" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-neutral-400 hover:text-yellow-400 transition-colors"
            >
              qrcode
            </a>
          </div>
        </div>
        {/* === END: ADDED SECTION === */}
        
      </div>
    </div>
  );
};

export default QRCodeGenerator;