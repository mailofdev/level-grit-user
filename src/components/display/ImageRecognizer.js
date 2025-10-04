import { useState } from 'react';
import { Upload, Camera, Loader2, X, Image as ImageIcon, Palette, Info } from 'lucide-react';

export default function ImageRecognizer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResults(null);
    }
  };

  const analyzeImage = async () => {
    if (!image || !preview) return;
    
    setLoading(true);
    
    // Create an image element to analyze
    const img = new Image();
    img.src = preview;
    
    img.onload = () => {
      // Create canvas to extract image data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Calculate dominant colors
      const colorMap = {};
      for (let i = 0; i < data.length; i += 40) { // Sample every 10th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const rgb = `rgb(${r}, ${g}, ${b})`;
        colorMap[rgb] = (colorMap[rgb] || 0) + 1;
      }
      
      // Get top 5 colors
      const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color, count]) => ({
          color,
          percentage: ((count / Object.values(colorMap).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        }));
      
      // Calculate average brightness
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += brightness;
      }
      const avgBrightness = totalBrightness / (data.length / 4);
      
      // Detect if image is mostly dark or light
      const isDark = avgBrightness < 128;
      
      // Calculate color variance (how colorful the image is)
      let colorVariance = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        colorVariance += Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
      }
      colorVariance = colorVariance / (data.length / 4);
      
      const isColorful = colorVariance > 30;
      
      // File information
      const fileSize = (image.size / 1024).toFixed(2);
      const fileSizeUnit = fileSize > 1024 ? 'MB' : 'KB';
      const displaySize = fileSize > 1024 ? (fileSize / 1024).toFixed(2) : fileSize;
      
      const analysisResults = {
        fileName: image.name,
        fileType: image.type,
        fileSize: `${displaySize} ${fileSizeUnit}`,
        dimensions: `${img.width} × ${img.height} pixels`,
        aspectRatio: (img.width / img.height).toFixed(2),
        dominantColors: sortedColors,
        brightness: isDark ? 'Dark' : 'Light',
        brightnessValue: avgBrightness.toFixed(0),
        colorfulness: isColorful ? 'Colorful' : 'Monochromatic',
        colorVariance: colorVariance.toFixed(0),
        megapixels: ((img.width * img.height) / 1000000).toFixed(2),
        timestamp: new Date().toLocaleString()
      };
      
      setResults(analysisResults);
      setLoading(false);
    };
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
            <Camera className="w-10 h-10 text-indigo-600" />
            Image Analyzer
          </h1>
          <p className="text-gray-600 text-lg">Upload any image to analyze its properties and details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-16 h-16 text-gray-400 mb-4 group-hover:text-indigo-500 transition-colors" />
                <p className="mb-2 text-lg text-gray-600">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP (Max 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-xl bg-gray-50 shadow-lg"
                />
                <button
                  onClick={reset}
                  className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!results && !loading && (
                <button
                  onClick={analyzeImage}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  Analyze Image
                </button>
              )}

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                  <span className="ml-3 text-gray-600 text-lg">Analyzing image...</span>
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  {/* File Information */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-6 h-6" />
                      <h3 className="text-xl font-bold">File Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="opacity-90 mb-1">File Name</p>
                        <p className="font-semibold truncate">{results.fileName}</p>
                      </div>
                      <div>
                        <p className="opacity-90 mb-1">File Size</p>
                        <p className="font-semibold">{results.fileSize}</p>
                      </div>
                      <div>
                        <p className="opacity-90 mb-1">Dimensions</p>
                        <p className="font-semibold">{results.dimensions}</p>
                      </div>
                      <div>
                        <p className="opacity-90 mb-1">Megapixels</p>
                        <p className="font-semibold">{results.megapixels} MP</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Properties */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-gray-800">Image Properties</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Aspect Ratio</p>
                        <p className="text-2xl font-bold text-indigo-600">{results.aspectRatio}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Brightness</p>
                        <p className="text-2xl font-bold text-indigo-600">{results.brightness}</p>
                        <p className="text-xs text-gray-500">{results.brightnessValue}/255</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">Color Style</p>
                        <p className="text-2xl font-bold text-indigo-600">{results.colorfulness}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-gray-600 text-sm mb-1">File Type</p>
                        <p className="text-xl font-bold text-indigo-600">{results.fileType.split('/')[1].toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dominant Colors */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-bold text-gray-800">Dominant Colors</h3>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {results.dominantColors.map((colorData, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className="w-full h-20 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
                            style={{ backgroundColor: colorData.color }}
                            title={colorData.color}
                          />
                          <p className="text-xs text-gray-600 mt-2 font-semibold">{colorData.percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 pt-2">
                    <p>Analyzed at {results.timestamp}</p>
                  </div>

                  <button
                    onClick={reset}
                    className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-lg"
                  >
                    Analyze Another Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
          <p>🎨 Analyzes colors, brightness, dimensions, and image properties</p>
          <p>🔒 All processing happens in your browser - images never uploaded</p>
          <p>⚡ Instant analysis with no external APIs required</p>
        </div>
      </div>
    </div>
  );
}