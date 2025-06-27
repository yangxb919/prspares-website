'use client';

import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const MapSection = () => {
  const [mapError, setMapError] = useState(false);

  // 华强北的坐标信息
  const location = {
    name: "华强北商业区",
    address: "深圳市福田区华强北路",
    coordinates: "22.5484°N, 114.0851°E"
  };

  const handleMapError = () => {
    setMapError(true);
  };

  const openInGoogleMap = () => {
    window.open(
      'https://www.google.com/maps/search/华强北商业区,+深圳市/@22.5484,114.0851,15z',
      '_blank'
    );
  };

  if (mapError) {
    return (
      <div className="w-full h-[450px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden border border-gray-300 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 text-green-600 mx-auto" />
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{location.name}</h4>
            <p className="text-gray-600 mb-1">{location.address}</p>
            <p className="text-sm text-gray-500 mb-4">{location.coordinates}</p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={openInGoogleMap}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              在Google地图中查看
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] bg-gray-200 rounded-xl shadow-lg overflow-hidden border border-gray-300 relative">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.8116120903883!2d114.08210831495738!3d22.548350985199544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3403f4f4b5c2c97f%3A0x1e4bb1b1e8e6e8e8!2sHuaqiangbei%2C%20Futian%20District%2C%20Shenzhen%2C%20Guangdong%20Province%2C%20China!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="PRSPARES Office Location - Huaqiangbei, Shenzhen"
        className="w-full h-full"
        onError={handleMapError}
      />
      
      {/* Google地图外部链接按钮 */}
      <div className="absolute top-4 right-4">
        <button
          onClick={openInGoogleMap}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:text-green-600 transition-all duration-200 flex items-center gap-1"
          title="在Google地图中打开"
        >
          <ExternalLink className="w-3 h-3" />
          Google Maps
        </button>
      </div>
    </div>
  );
};

export default MapSection; 