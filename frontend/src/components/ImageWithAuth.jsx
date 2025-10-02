// Create a new file: ImageWithAuth.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';

const ImageWithAuth = ({ src, alt, className, fallback, onError }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchImage();
  }, [src]);

  const fetchImage = async () => {
    try {
      // Remove any leading 'api' from the URL path
      const cleanPath = src.replace(/^\/api\//, '/');
      
      const response = await API.get(cleanPath, {
        responseType: 'blob'
      });
      
      setImageUrl(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Image load error:', error);
      if (onError) onError(error);
      setImageUrl(null);
    }
  };

  if (!imageUrl && fallback) {
    return fallback;
  }

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        if (onError) onError(e);
        if (fallback) setImageUrl(null);
      }}
    />
  ) : fallback || null;
};

export default ImageWithAuth;