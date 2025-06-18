// Create a new file: ImageWithAuth.jsx
import React, { useState, useEffect } from 'react';
import API from '../api';

const ImageWithAuth = ({ src, alt, className, onError }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await API.get(src, {
          responseType: 'blob'
        });
        
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (err) {
        setError(true);
        if (onError) {
          onError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      fetchImage();
    }

    // Cleanup
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <img
        src="/placeholder-avatar.png"
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
};

export default ImageWithAuth;