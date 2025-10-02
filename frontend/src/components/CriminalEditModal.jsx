import React, { useState, useEffect, useRef } from "react";
import API from "../api";
import ImageWithAuth from "./ImageWithAuth";

const CriminalEditModal = ({ open, onClose, record, onUpdate }) => {
  const [form, setForm] = useState(record || {});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (record) {
      setForm(record);
      setErrors({});
      setImageFile(null);
      setImagePreview(null);
    }
  }, [record]);

  const fieldConfig = [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "crimeCode", label: "Crime Code", type: "text", required: true },
    { name: "address", label: "Address", type: "textarea", required: true },
    { name: "state", label: "State", type: "text", required: true },
    { name: "lga", label: "Local Government Area", type: "text", required: true },
    { 
      name: "gender", 
      label: "Gender", 
      type: "select", 
      options: ["Male", "Female", "Other"],
      required: true 
    },
    { name: "age", label: "Age", type: "number", min: 1, max: 120, required: true },
    { 
      name: "complexion", 
      label: "Complexion", 
      type: "select", 
      options: ["Fair", "Medium", "Dark", "Light", "Other"] 
    },
    { name: "height", label: "Height (cm)", type: "number", min: 50, max: 250 },
    { name: "weight", label: "Weight (kg)", type: "number", min: 20, max: 300 },
    { name: "remarks", label: "Remarks", type: "textarea" },
    { name: "officerInCharge", label: "Officer in Charge", type: "text", required: true },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    fieldConfig.forEach(field => {
      if (field.required && (!form[field.name] || form[field.name].toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === "number" && form[field.name]) {
        const value = parseFloat(form[field.name]);
        if (isNaN(value)) {
          newErrors[field.name] = `${field.label} must be a valid number`;
        } else if (field.min && value < field.min) {
          newErrors[field.name] = `${field.label} must be at least ${field.min}`;
        } else if (field.max && value > field.max) {
          newErrors[field.name] = `${field.label} must be at most ${field.max}`;
        }
      }
    });

    // Image validation
    if (imageFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      
      if (imageFile.size > maxSize) {
        newErrors.image = "Image size should not exceed 5MB";
      }
      
      if (!allowedTypes.includes(imageFile.type)) {
        newErrors.image = "Only JPEG, PNG, and GIF images are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any existing image error
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append all form data
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      // Append image if selected
      if (imageFile) {
        formData.append('photo', imageFile);
      }

      await API.put(`/criminals/${record._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating criminal record:", error);
      setErrors({ submit: error.response?.data?.message || 'Failed to update record' });
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = () => {
    return (
      <div className="md:col-span-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Photo
        </h3>
        
        <div className="flex items-start space-x-4">
          {/* Current/Preview Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : record?._id ? (
                <ImageWithAuth
                  src={`/criminals/photo/${record._id}`}
                  alt="Current photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Upload Controls */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {imagePreview || record?._id ? 'Change Photo' : 'Upload Photo'}
                </button>
                
                {(imagePreview || imageFile) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                Accepted formats: JPEG, PNG, GIF. Max size: 5MB
              </p>
              
              {imageFile && (
                <p className="text-xs text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  New image selected: {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {errors.image && (
          <p className="mt-2 text-sm text-red-600">{errors.image}</p>
        )}
      </div>
    );
  };

  const renderField = (field) => {
    const baseClasses = `w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors[field.name] 
        ? "border-red-300 bg-red-50" 
        : "border-gray-200 focus:border-blue-500"
    }`;

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={form[field.name] || ""}
            onChange={handleChange}
            className={`${baseClasses} resize-none h-24`}
            rows={3}
          />
        );
      
      case "select":
        return (
          <select
            name={field.name}
            value={form[field.name] || ""}
            onChange={handleChange}
            className={baseClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case "number":
        return (
          <input
            type="number"
            name={field.name}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={form[field.name] || ""}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            className={baseClasses}
          />
        );
      
      default:
        return (
          <input
            type="text"
            name={field.name}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={form[field.name] || ""}
            onChange={handleChange}
            className={baseClasses}
          />
        );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Edit Criminal Record</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photo Section */}
              {renderImageSection()}
              
              {fieldConfig.map((field) => (
                <div key={field.name} className={field.name === "address" || field.name === "remarks" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 py-4 px-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriminalEditModal;