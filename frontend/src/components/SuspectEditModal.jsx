import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import ImageWithAuth from "./ImageWithAuth";

const SuspectEditModal = ({ open, onClose, record, onUpdate }) => {
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

  const fieldLabels = {
    name: "Full Name",
    crimeCode: "Crime Code",
    address: "Address",
    state: "State",
    lga: "Local Government Area",
    gender: "Gender",
    age: "Age",
    complexion: "Complexion",
    height: "Height",
    weight: "Weight",
    remarks: "Remarks",
    officerInCharge: "Officer in Charge"
  };

  const genderOptions = ["Male", "Female", "Other"];
  const complexionOptions = ["Fair", "Medium", "Dark"];
  const heightOptions = ["Short", "Average", "Tall", "Very Tall"];
  const weightOptions = ["Slim", "Average", "Heavy", "Very Heavy"];

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "crimeCode", "address", "state", "lga", "gender"];
    
    requiredFields.forEach(field => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = `${fieldLabels[field]} is required`;
      }
    });

    // Age validation
    if (form.age && (isNaN(form.age) || form.age < 1 || form.age > 150)) {
      newErrors.age = "Please enter a valid age between 1 and 150";
    }

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
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
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
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // If there's a new image, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('type', 'suspect');
        formData.append('id', record._id);
        
        const imageResponse = await API.post('/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Add the image path to the form data
        form.imagePath = imageResponse.data.imagePath;
      }
      
      await API.put(`/suspects/${record._id}`, form);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating suspect:", error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const renderImageSection = () => {
    return (
      <div className="md:col-span-2 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  src={`/suspects/photo/${record._id}`}
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
                  className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
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
    const isTextarea = field === "address" || field === "remarks";
    const isSelect = ["gender", "complexion"].includes(field);
    const isNumber = ["age", "height", "weight"].includes(field);
    const isRequired = ["name", "crimeCode", "address", "state", "lga", "gender"].includes(field);

    let options = [];
    if (field === "gender") options = genderOptions;
    else if (field === "complexion") options = complexionOptions;
    else if (field === "height") options = heightOptions;
    else if (field === "weight") options = weightOptions;

    return (
      <div key={field} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {fieldLabels[field]}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {isSelect ? (
          <select
            name={field}
            value={form[field] || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors[field] ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Select {fieldLabels[field]}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea
            name={field}
            value={form[field] || ""}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-vertical ${
              errors[field] ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
          />
        ) : (
          <input
            type={isNumber ? "number" : "text"}
            name={field}
            value={form[field] || ""}
            onChange={handleChange}
            min={isNumber ? "1" : undefined}
            max={isNumber ? "150" : undefined}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
              errors[field] ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
          />
        )}
        
        {errors[field] && (
          <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
        )}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Suspect Information
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo Section */}
            {renderImageSection()}
            
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h3>
            </div>
            
            {renderField("name")}
            {renderField("crimeCode")}
            {renderField("gender")}
            {renderField("age")}
            
            {/* Address Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-4 border-b border-gray-200 pb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address Information
              </h3>
            </div>
            
            <div className="md:col-span-2">
              {renderField("address")}
            </div>
            {renderField("state")}
            {renderField("lga")}
            
            {/* Physical Description */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-4 border-b border-gray-200 pb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Physical Description
              </h3>
            </div>
            
            {renderField("complexion")}
            {renderField("height")}
            {renderField("weight")}
            
            {/* Additional Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-3 mt-4 border-b border-gray-200 pb-2 flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Additional Information
              </h3>
            </div>
            
            {renderField("officerInCharge")}
            
            <div className="md:col-span-2">
              {renderField("remarks")}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? "Updating..." : "Update Suspect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspectEditModal;